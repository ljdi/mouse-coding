import { pathToFileURL } from "@/packages/url";
import {
  InvalidModuleSpecifierError,
  InvalidPackageTargetError,
  isUrl,
} from "./utils";

/**
 * Check for invalid path segments
 */
function includesInvalidSegments(
  pathSegments: readonly string[],
  moduleDirs: readonly string[],
) {
  const invalidSegments = ["", ".", "..", ...moduleDirs];

  // contains any "", ".", "..", or "node_modules" segments, including percent encoded variants
  return pathSegments.some(
    (v) =>
      invalidSegments.includes(v) || invalidSegments.includes(decodeURI(v)),
  );
}

interface ParamObject {
  target: any;
  patternMatch?: string;
  isImports?: boolean;
}

async function resolvePackageTarget(
  context: any,
  { target, patternMatch, isImports }: ParamObject,
): Promise<null | undefined | string | URL> {
  // If target is a String, then
  if (typeof target === "string") {
    // If target does not start with "./", then
    if (!target.startsWith("./")) {
      // If isImports is false, or if target starts with "../" or "/", or if target is a valid URL, then
      if (
        !isImports ||
        ["/", "../"].some((p) => target.startsWith(p)) ||
        isUrl(target)
      ) {
        // Throw an Invalid Package Target error.
        throw new InvalidPackageTargetError(
          context,
          `Invalid mapping: "${target}".`,
        );
      }

      // If patternMatch is a String, then
      if (typeof patternMatch === "string") {
        // Return PACKAGE_RESOLVE(target with every instance of "*" replaced by patternMatch, packageURL + "/")
        const result = await context.resolveId(
          target.replace(/\*/g, patternMatch),
          context.pkgURL.href,
        );
        return result ? pathToFileURL(result.location).href : null;
      }

      // Return PACKAGE_RESOLVE(target, packageURL + "/").
      const result = await context.resolveId(target, context.pkgURL.href);
      return result ? pathToFileURL(result.location).href : null;
    }

    // TODO: Drop if we do not support Node <= 16 anymore
    // This behavior was removed in Node 17 (deprecated in Node 14), see DEP0148
    if (context.allowExportsFolderMapping) {
      target = target.replace(/\/$/, "/*");
    }

    // If target split on "/" or "\"
    {
      const pathSegments = target.split(/\/|\\/);
      // after the first "." segment
      const firstDot = pathSegments.indexOf(".");
      firstDot !== -1 && pathSegments.slice(firstDot);
      if (
        firstDot !== -1 &&
        firstDot < pathSegments.length - 1 &&
        includesInvalidSegments(
          pathSegments.slice(firstDot + 1),
          context.moduleDirs,
        )
      ) {
        throw new InvalidPackageTargetError(
          context,
          `Invalid mapping: "${target}".`,
        );
      }
    }

    // Let resolvedTarget be the URL resolution of the concatenation of packageURL and target.
    const resolvedTarget = new URL(target, context.pkgURL);
    // Assert: resolvedTarget is contained in packageURL.
    if (!resolvedTarget.href.startsWith(context.pkgURL.href)) {
      throw new InvalidPackageTargetError(
        context,
        `Resolved to ${resolvedTarget.href} which is outside package ${context.pkgURL.href}`,
      );
    }

    // If patternMatch is null, then
    if (!patternMatch) {
      // Return resolvedTarget.
      return resolvedTarget;
    }

    // If patternMatch split on "/" or "\" contains invalid segments
    if (
      includesInvalidSegments(patternMatch.split(/\/|\\/), context.moduleDirs)
    ) {
      // throw an Invalid Module Specifier error.
      throw new InvalidModuleSpecifierError(context);
    }

    // Return the URL resolution of resolvedTarget with every instance of "*" replaced with patternMatch.
    return resolvedTarget.href.replace(/\*/g, patternMatch);
  }

  // Otherwise, if target is an Array, then
  if (Array.isArray(target)) {
    // If _target.length is zero, return null.
    if (target.length === 0) {
      return null;
    }

    let lastError = null;
    // For each item in target, do
    for (const item of target) {
      // Let resolved be the result of PACKAGE_TARGET_RESOLVE of the item
      // continuing the loop on any Invalid Package Target error.
      try {
        const resolved = await resolvePackageTarget(context, {
          target: item,
          patternMatch,
          isImports,
        });
        // If resolved is undefined, continue the loop.
        // Else Return resolved.
        if (resolved !== undefined) {
          return resolved;
        }
      } catch (error) {
        if (!(error instanceof InvalidPackageTargetError)) {
          throw error;
        } else {
          lastError = error;
        }
      }
    }
    // Return or throw the last fallback resolution null return or error
    if (lastError) {
      throw lastError;
    }
    return null;
  }

  // Otherwise, if target is a non-null Object, then
  if (target && typeof target === "object") {
    // For each property of target
    for (const [key, value] of Object.entries(target)) {
      // If exports contains any index property keys, as defined in ECMA-262 6.1.7 Array Index, throw an Invalid Package Configuration error.
      // TODO: We do not check if the key is a number here...
      // If key equals "default" or conditions contains an entry for the key, then
      if (key === "default" || context.conditions.includes(key)) {
        // Let targetValue be the value of the property in target.
        // Let resolved be the result of PACKAGE_TARGET_RESOLVE of the targetValue
        const resolved = await resolvePackageTarget(context, {
          target: value,
          patternMatch,
          isImports,
        });
        // If resolved is equal to undefined, continue the loop.
        // Return resolved.
        if (resolved !== undefined) {
          return resolved;
        }
      }
    }
    // Return undefined.
    return undefined;
  }

  // Otherwise, if target is null, return null.
  if (target === null) {
    return null;
  }

  // Otherwise throw an Invalid Package Target error.
  throw new InvalidPackageTargetError(context, `Invalid exports field.`);
}

export default resolvePackageTarget;
