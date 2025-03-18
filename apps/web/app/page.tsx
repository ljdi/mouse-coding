import { Card } from "@repo/ui/card";
import { add } from "@repo/example/add";

export default function Page() {
  return (
    <Card title="Hello World" href="https://example.com">
      {add(1, 2)}
    </Card>
  );
}
