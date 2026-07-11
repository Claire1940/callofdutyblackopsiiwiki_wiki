import {
	BookOpen,
	Crosshair,
	Users,
	Skull,
	MonitorSmartphone,
	Package,
	Download,
	Award,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// Call of Duty Black Ops II 内容导航分类（与 content/<locale>/ 目录一一对应）
// 顺序按玩家旅程排列：新手指南 → 战役 → 多人 → 僵尸 → 平台 → 版本 → DLC → 评价
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'campaign', path: '/campaign', icon: Crosshair, isContentType: true },
	{ key: 'multiplayer', path: '/multiplayer', icon: Users, isContentType: true },
	{ key: 'zombies', path: '/zombies', icon: Skull, isContentType: true },
	{ key: 'platforms', path: '/platforms', icon: MonitorSmartphone, isContentType: true },
	{ key: 'editions', path: '/editions', icon: Package, isContentType: true },
	{ key: 'dlc', path: '/dlc', icon: Download, isContentType: true },
	{ key: 'legacy', path: '/legacy', icon: Award, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guide', 'campaign', ...]

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
