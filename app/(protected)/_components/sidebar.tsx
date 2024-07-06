"use client"

import React from 'react';
import Link from "next/link";
import { links, RoleLinks, Link as LinkType } from "@/app/(protected)/_constants"; // Adjust the path as needed
import { useCurrentRole } from "@/hooks/use-current-role";
import { FaUser, FaCalendar, FaCog, FaUsers, FaCut, FaCashRegister } from 'react-icons/fa';
import "./style.css"

const Sidebar = () => {
  const userRole = useCurrentRole();

  // Ensure that access to links is safe and correct
  const roleLinks: LinkType[] = links[userRole as keyof RoleLinks] || [];

  // Map titles to icons
  const icons: { [key: string]: any } = {
    "Client": <FaUser />,
    "Schedule": <FaCalendar />,
    "Settings": <FaCog />,
    "Admin": <FaUsers />,
    "Time Intervals": <FaCut />
  };

  return (
    <div className="sidebar">
      {roleLinks.map((link, index) => (
        <Link key={index} href={link.path}>
          <div className="link-container">
            <span className="icon">{icons[link.title]}</span>
            <span className="link-title">{link.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
