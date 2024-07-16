"use client"

import React from 'react';
import Link from "next/link";
import { links, RoleLinks, Link as LinkType } from "@/app/(protected)/_constants"; // Adjust the path as needed
import { useCurrentRole } from "@/hooks/use-current-role";
import { FaUser, FaCalendar, FaCog, FaUsers, FaCut, FaCashRegister, FaShoppingCart, FaClipboardList, FaChartLine, FaBox, FaChalkboardTeacher, FaBookOpen } from 'react-icons/fa';
import { ScrollArea } from "@/components/ui/scroll-area"; // Importe o componente de scroll do shadcn UI
import "./style.css"
import UserButton from '@/components/auth/user-button';

const Sidebar = () => {
  const userRole = useCurrentRole();

  // Ensure that access to links is safe and correct
  const roleLinks: LinkType[] = links[userRole as keyof RoleLinks] || [];

  // Map titles to icons
  const icons: { [key: string]: any } = {
    "Client": <FaUser />,
    "Barber": <FaUser />,
    "Schedule": <FaCalendar />,
    "Settings": <FaCog />,
    "Admin": <FaUser />,
    "Time": <FaCalendar />,
    "Finance": <FaCashRegister />,
    "Sales": <FaChartLine />,
    "Purchases": <FaShoppingCart />,
    "Reports": <FaClipboardList />,
    "Catalog": <FaBox />,
    "History": <FaClipboardList />,
    "Barbers": <FaCut />,
    "Cuts": <FaBookOpen />,
    "Courses": <FaChalkboardTeacher />
  };

  return (
    <div className="sidebar">
      <ScrollArea className='p-4 pr-7'>
        {roleLinks.map((link, index) => (
          <Link key={index} href={link.path}>
            <div className="link-container">
              <span className="icon">{icons[link.title]}</span>
              <span className="link-title">{link.title}</span>
            </div>
          </Link>
        ))}
        <div className='button-user'>
          <UserButton />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
