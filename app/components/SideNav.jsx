"use client";

import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/styles/sideNav.module.css";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  RiVipCrownLine as VipIcon,
  RiDashboardHorizontalLine as DashboardIcon,
} from "react-icons/ri";
import {
  BiMoneyWithdraw as MoneyIcon,
  BiFootball as FootballIcon,
} from "react-icons/bi";
import { MdOutlineSettings as SettingsIcon } from "react-icons/md";
import { HiOutlineLogout as LogoutIcon } from "react-icons/hi";
import { TbInfoHexagon as AboutIcon } from "react-icons/tb";
import {
  IoReaderOutline as TermsIcon,
  IoNewspaperOutline as NewsIcon,
} from "react-icons/io5";
import {
  PiCourtBasketball as OtherSportIcon,
  PiTelegramLogo as TelegramLogo,
} from "react-icons/pi";
import { LuContact as ContactIcon } from "react-icons/lu";

import { RiMenu4Fill as MenuIcon } from "react-icons/ri";

export default function SideNav() {
  const { isAuth, isAdmin, logout } = useAuthStore();
  const { isOpen, toggleOpen } = useDrawerStore();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarClasses = `${styles.sideContainer} ${
    isMobile
      ? isOpen
        ? styles.showSideNav
        : styles.hideSideNav
      : styles.showSideNav
  }`;

  const openTelegram = () => {
    window.open("https://t.me/four_three_three_tips", "_blank");
  };

  const handleLogout = useCallback(async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  }, [logout]);

  return (
    <div className={sidebarClasses}>
      {isMobile && (
        <div onClick={toggleOpen} className={styles.toggleMenuButton}>
          <MenuIcon
            className={styles.toggleMenuIcon}
            aria-label="Toggle menu"
            alt="toggle menu icon"
          />
        </div>
      )}
      <div className={styles.sideLogo}>
        <Image
          className={styles.logo}
          src={LogoImg}
          alt="logo"
          height={40}
          priority
        />
      </div>
      <div className={styles.sideTop}>
        {isAdmin && (
          <Link
            href="/page/dashboard/?card=revenue"
            className={styles.sideLink}
          >
            <div
              className={`${styles.innerSideLink} ${
                pathname === "/page/dashboard" ||
                pathname.startsWith("/page/dashboard/")
                  ? styles.activeLink
                  : ""
              }`}
            >
              <DashboardIcon
                alt="dashboard icon"
                aria-label="dashboard icon"
                className={styles.linkIcon}
              />
              <h1>Dashboard</h1>
            </div>
          </Link>
        )}
        <Link href="/page/football" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/football" ||
              pathname.startsWith("/page/football/")
                ? styles.activeLink
                : ""
            }`}
          >
            <FootballIcon
              alt="football icon"
              aria-label="football icon"
              className={styles.linkIcon}
            />
            <h1>Football</h1>
          </div>
        </Link>
        <Link href="/page/otherSport" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/otherSport" ||
              pathname.startsWith("/page/otherSport/")
                ? styles.activeLink
                : ""
            }`}
          >
            <OtherSportIcon
              alt="football icon"
              aria-label="football icon"
              className={styles.linkIcon}
            />
            <h1>Other Sports</h1>
          </div>
        </Link>

        <Link href="/page/vip" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/vip" || pathname.startsWith("/page/vip/")
                ? styles.activeLink
                : ""
            }`}
          >
            <VipIcon alt="vip icon" className={styles.linkIcon} />
            <h1>Vip</h1>
          </div>
        </Link>
        <Link href="/page/payment" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/payment" ||
              pathname.startsWith("/page/payment/")
                ? styles.activeLink
                : ""
            }`}
          >
            <MoneyIcon
              alt="payment icon"
              aria-label="payment icon"
              className={styles.linkIcon}
            />
            <h1>How to pay</h1>
          </div>
        </Link>

        <div className={styles.sideLink} onClick={openTelegram}>
          <div className={styles.innerSideLink}>
            <TelegramLogo
              alt="telegran icon"
              aria-label="telegram icon"
              className={styles.linkIcon}
            />
            <h1>Join telegram</h1>
          </div>
        </div>
        <Link href="/page/news" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/news" || pathname.startsWith("/page/news/")
                ? styles.activeLink
                : ""
            }`}
          >
            <NewsIcon
              alt="news icon"
              aria-label="news icon"
              className={styles.linkIcon}
            />
            <h1>SportNews</h1>
          </div>
        </Link>
        <Link href="/page/about" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/about" || pathname.startsWith("/page/about/")
                ? styles.activeLink
                : ""
            }`}
          >
            <AboutIcon
              alt="about icon"
              aria-label="about icon"
              className={styles.linkIcon}
            />
            <h1>About us</h1>
          </div>
        </Link>

        <Link href="/page/terms" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/terms" || pathname.startsWith("/page/terms/")
                ? styles.activeLink
                : ""
            }`}
          >
            <TermsIcon
              alt="terms icon"
              aria-label="terms icon"
              className={styles.linkIcon}
            />
            <h1>Terms</h1>
          </div>
        </Link>
        <Link href="/page/contact" className={styles.sideLink}>
          <div
            className={`${styles.innerSideLink} ${
              pathname === "/page/contact" ||
              pathname.startsWith("/page/contact/")
                ? styles.activeLink
                : ""
            }`}
          >
            <ContactIcon
              alt="contact icon"
              aria-label="contact icon"
              className={styles.linkIcon}
            />
            <h1>Contact</h1>
          </div>
        </Link>
      </div>
      {isAuth && (
        <div className={styles.sideBottomContainer}>
          <Link href="/page/settings" className={styles.sideLink}>
            <div
              className={`${styles.innerSideLink} ${
                pathname === "/page/settings" ||
                pathname.startsWith("/page/settings/")
                  ? styles.activeLink
                  : ""
              }`}
            >
              <SettingsIcon
                alt="settings icon"
                aria-label="settings icon"
                className={styles.linkIcon}
              />
              <h1>settings</h1>
            </div>
          </Link>
          <div className={styles.sideBottom} onClick={handleLogout}>
            <LogoutIcon
              alt="logout icon"
              aria-label="logout icon"
              className={styles.linkIcon}
            />
          </div>
        </div>
      )}
    </div>
  );
}
