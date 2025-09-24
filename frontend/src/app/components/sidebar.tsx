// import { Link as RouterLink, useLocation } from 'react-router-dom';
// import { Link } from '../ui/link';
// import { Icon } from '../ui/icon';
// import { useEffect, type ReactNode } from 'react';
// import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
// import { Collapse as MantineCollapse } from '@mantine/core';
// import { navMenus } from '../constants/sidebar';
// // import type { NavItem, NavMenu } from '../types';
// import { useDisclosure } from '@mantine/hooks';
// import { cn } from '../utils/cn';


// const LinkItem = ({ href, text, activeIcon, inActiveIcon, className }: NavItem) => {
//   const currentUrl = useLocation().pathname;
//   const isActive = currentUrl === href;

//   return (
//     <Link
//       key={href}
//       component={RouterLink}
//       to={href}
//       className={cn(
//         'flex items-center gap-5 rounded-lg hover:no-underline font-medium p-3 transition-colors',
//         isActive 
//           ? 'bg-primary-500 text-white' 
//           : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
//       )}
//     >
//       <Icon
//         name={isActive ? activeIcon : inActiveIcon}
//         className={cn('min-w-6 min-h-6 max-w-6 max-h-6', className, {
//           'text-white': isActive,
//           'text-gray-500': !isActive,
//         })}
//       />
//       <span className="flex items-center gap-2">
//       {t(text)}
//       </span>
//     </Link>
//   );
// };

// const SidebarCollapse = ({ item, children }: { item: NavMenu; children: ReactNode }) => {
//   const currentUrl = useLocation().pathname;
//   const [opened, { toggle, open }] = useDisclosure(false);

//   const isParentActive = item.items.some(
//     (i) => currentUrl === i.href || currentUrl.startsWith(i.href)
//   );

//   useEffect(() => {
//     if (isParentActive) open();
//   }, [isParentActive, open]);

//   const parentHref = item.items[0]?.href;

//   return (
//     <div
//       className={cn(
//         'flex flex-col rounded-lg transition-colors',
//         opened && 'bg-gray-50'
//       )}
//     >
//       <Link
//         component={RouterLink}
//         to={parentHref}
//         onClick={toggle}
//         className={cn(
//           'flex justify-between items-center cursor-pointer p-3 rounded-lg hover:no-underline transition-colors',
//           isParentActive 
//             ? 'bg-primary-100 text-primary-700' 
//             : 'text-gray-700 hover:bg-gray-100',
//         )}
//       >
//         <div className="flex items-center gap-3">
//           <Icon 
//             name={item.activeIcon} 
//             className={cn('min-w-6 min-h-6 max-w-6 max-h-6', {
//               'text-primary-500': isParentActive,
//               'text-gray-500': !isParentActive,
//             })} 
//           />
//           <div className="font-semibold">{item.title}</div>
//         </div>
//         {opened ? (
//           <FaAngleUp className="text-xl text-gray-500" />
//         ) : (
//           <FaAngleDown className="text-xl text-gray-500" />
//         )}
//       </Link>
      
//       <MantineCollapse in={opened} className="flex flex-col mt-1">
//         {children}
//       </MantineCollapse>
//     </div>
//   );
// };
// export const Sidebar = () => {
//   const {user} = useAuth()
//   const collapsibleMenus = ['User Management'];

//   const filteredMenus = navMenus.filter((menu) => {
//     if (user?.type === 'student') {
//       return !['User Management', 'Reports', 'Templates', 'Scan Job'].includes(menu.title);
//     }

//     if (user?.type === 'teacher') {
//       return menu.title !== 'User Management';
//     }

//     return true;
//   });

//   return (
//     <div className="flex flex-col gap-2">
//       {filteredMenus.map((menu) => {
//         const isCollapsible = collapsibleMenus.includes(menu.title);

//         if (isCollapsible) {
//           return (
//             <SidebarCollapse key={menu.title} item={{ ...menu }}>
//             {menu.items.map((props) => (
//               <LinkItem key={props.href} {...props} />
//             ))}
//           </SidebarCollapse>
//           );
//         }

//         return menu.items.map((item) => <LinkItem key={item.href} {...item} />);
//       })}
//     </div>
//   );
// };
