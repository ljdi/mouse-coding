import { type FC, type ReactNode } from 'react'

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { cn } from '@/lib/utils'

// 菜单项类型枚举
type MenuItemType = 'item' | 'checkbox' | 'radio-group' | 'radio' | 'submenu' | 'separator' | 'label'

// 菜单项基础接口
interface BaseMenuItem {
  id: string // 唯一标识符
  type: MenuItemType // 菜单项类型
  textValue: string // 显示文本
  shortcut?: string // 快捷键
  icon?: string // 图标 (可选)
  disabled?: boolean // 是否禁用
  inset?: boolean // 是否缩进
}

// 普通菜单项
interface SimpleMenuItem extends BaseMenuItem {
  type: 'item'
}

// 分隔符
interface SeparatorItem extends BaseMenuItem {
  type: 'separator'
}

// 标签项
interface LabelItem extends BaseMenuItem {
  type: 'label'
}

// 复选框菜单项
interface CheckboxItem extends BaseMenuItem {
  type: 'checkbox'
  checked: boolean
}

interface RadioItem extends BaseMenuItem {
  type: 'radio'
  value: string
}

// 单选组和单选项
interface RadioGroupItem extends BaseMenuItem {
  type: 'radio-group'
  items: (RadioItem | SeparatorItem)[]
  value: string
}

// 子菜单项
interface SubmenuItem extends BaseMenuItem {
  type: 'submenu'
  // eslint-disable-next-line no-use-before-define
  items: ConfigurableContextMenuItem[] // 子菜单项
  className?: string // 子菜单的CSS类
}

// 联合类型表示所有可能的菜单项类型
export type ConfigurableContextMenuItem =
  | SimpleMenuItem
  | SeparatorItem
  | LabelItem
  | CheckboxItem
  | RadioGroupItem
  | SubmenuItem
  | RadioItem

export type OnSelect = (event: Event, item: ConfigurableContextMenuItem) => void
export type OnCheckedChange = (checked: boolean, item: CheckboxItem) => void
export type OnValueChange = (value: string, item: RadioGroupItem) => void

interface ContextMenuRender {
  (
    item: ConfigurableContextMenuItem,
    handlers?: {
      onSelect?: OnSelect
      onCheckedChange?: OnCheckedChange
      onValueChange?: OnValueChange
    },
  ): ReactNode | null
}

const contextMenuRender: ContextMenuRender = (item, handlers = {}) => {
  const { onSelect: handleSelect, onCheckedChange: handleCheckedChange, onValueChange: handleValueChange } = handlers
  switch (item.type) {
    case 'item':
      return (
        <ContextMenuItem
          key={item.id}
          inset={item.inset}
          disabled={item.disabled}
          onSelect={(event) => handleSelect?.(event, item)}
        >
          {item.textValue}
          {item.shortcut && <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>}
        </ContextMenuItem>
      )
    case 'separator':
      return <ContextMenuSeparator key={item.id} />
    case 'label':
      return (
        <ContextMenuLabel key={item.id} inset={item.inset}>
          {item.textValue}
        </ContextMenuLabel>
      )
    case 'checkbox':
      return (
        <ContextMenuCheckboxItem
          key={item.id}
          checked={item.checked}
          disabled={item.disabled}
          onSelect={(event) => handleSelect?.(event, item)}
          onCheckedChange={(checked: boolean) => handleCheckedChange?.(checked, item)}
        >
          {item.textValue}
          {item.shortcut && <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>}
        </ContextMenuCheckboxItem>
      )
    case 'radio-group':
      return (
        <ContextMenuRadioGroup
          key={item.id}
          value={item.value}
          onValueChange={(value: string) => handleValueChange?.(value, item)}
        >
          <ContextMenuLabel inset={item.inset}>{item.textValue}</ContextMenuLabel>
          {item.items.map((subItem) => {
            return contextMenuRender(subItem, handlers)
          })}
        </ContextMenuRadioGroup>
      )
    case 'radio':
      return (
        <ContextMenuRadioItem value={item.value} onSelect={(event) => handleSelect?.(event, item)}>
          {item.textValue}
          {item.shortcut && <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>}
        </ContextMenuRadioItem>
      )
    case 'submenu':
      return (
        <ContextMenuSub>
          <ContextMenuSubTrigger key={item.id} inset={item.inset} disabled={item.disabled}>
            {item.textValue}
            {item.shortcut && <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className={cn('w-64', item.className)}>
            {item.items.map((subItems) => {
              return contextMenuRender(subItems, handlers)
            })}
          </ContextMenuSubContent>
        </ContextMenuSub>
      )
    default:
      return null
  }
}

export interface ConfigurableContextMenuProps {
  children: ReactNode
  items: ConfigurableContextMenuItem[]
  triggerClassName?: string // 触发器的CSS类
  contentClassName?: string // 额外的CSS类
  onSelect?: OnSelect
  onCheckedChange?: OnCheckedChange
  onValueChange?: OnValueChange
}

export const ConfigurableContextMenu: FC<ConfigurableContextMenuProps> = ({
  children,
  items,
  triggerClassName,
  contentClassName,
  onSelect,
  onCheckedChange,
  onValueChange,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={cn('h-full w-full', triggerClassName)}>{children}</ContextMenuTrigger>
      <ContextMenuContent className={cn('w-64', contentClassName)}>
        {items.map((item) => {
          return contextMenuRender(item, { onSelect, onCheckedChange, onValueChange })
        })}
      </ContextMenuContent>
    </ContextMenu>
  )
}
