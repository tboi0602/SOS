"use client";

import { FileText, TrendingUp, Users, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDashboard } from "@/hook/admin/useDashboard";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import SplitHeading from "@/components/ui/SplitHeading";
import StatCard from "@/components/admin/dashboard/StatCard";
import ChartSection from "@/components/admin/dashboard/ChartSection";
import MemberTable from "@/components/admin/dashboard/MemberTable";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

export default function AdminDashboard() {
  const {
    loading,
    search,
    setSearch,
    sortKey,
    sortDir,
    page,
    setPage,
    handleSort,
    handleBlock,
    handleUnblock,
    stats,
    chartData,
    paged,
    totalPages,
    sortedLength,
  } = useDashboard();
  const dashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const statTl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        statTl
          .fromTo(
            q(".stat-card"),
            { y: 40, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.5,
              force3D: true,
              stagger: gsap.utils.distribute({
                base: 0.03,
                amount: 0.35,
                from: "start",
                ease: "power1.out",
              }),
              ease: "power3.out",
            },
          )
          .call(
            () => {
              q(".stat-value").forEach((el) => {
                const target = parseFloat(
                  el.getAttribute("data-target") || "0",
                );
                if (isNaN(target)) return;
                const obj = { val: 0 };
                gsap.to(obj, {
                  val: target,
                  duration: 0.8,
                  ease: "power2.out",
                  onUpdate: () => {
                    el.textContent =
                      target % 1 === 0
                        ? String(Math.round(obj.val))
                        : obj.val.toFixed(1);
                  },
                });
              });
            },
            [],
            "-=0.1",
          )
          .fromTo(
            q(".stat-icon"),
            { scale: 1 },
            {
              scale: 1.15,
              duration: 0.15,
              ease: "power2.out",
              force3D: true,
              stagger: 0.08,
            },
            "-=0.3",
          )
          .to(q(".stat-icon"), {
            scale: 1,
            duration: 0.3,
            ease: "back.out(2)",
            force3D: true,
            stagger: 0.08,
          });

        gsap.fromTo(
          q(".chart-section"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            force3D: true,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          },
        );
        gsap.fromTo(
          q(".member-row"),
          { y: 20, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            force3D: true,
            stagger: gsap.utils.distribute({
              base: 0.01,
              amount: 0.25,
              from: "start",
              ease: "power1.inOut",
            }),
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );

        q(".stat-card").forEach((card) => {
          gsap.to(card, {
            y: gsap.utils.mapRange(0, 1, -8, 8),
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      });
    });

    return () => ctx.revert();
  }, [loading]);

  return (
    <div ref={dashRef} className="p-6 space-y-6 animate-fade-up">
      <div>
        <SplitHeading text="Bảng điều khiển" className="text-2xl font-bold" />
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          Quản lý thành viên và giám sát hệ thống
        </p>
      </div>
      <Skeleton name="admin-dashboard" loading={loading}>
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Tổng thành viên"
              value={stats.total}
              rawValue={stats.total}
              icon={Users}
              color="from-accent to-accent-dark"
            />
            <StatCard
              label="Đang hoạt động"
              value={stats.active}
              rawValue={stats.active}
              icon={Award}
              color="from-emerald-400 to-emerald-600"
            />
            <StatCard
              label="Tổng điểm"
              value={stats.totalScore.toLocaleString("vi-VN")}
              rawValue={stats.totalScore}
              icon={TrendingUp}
              color="from-amber-400 to-amber-600"
            />
            <StatCard
              label="Bài viết"
              value={stats.totalPosts.toLocaleString("vi-VN")}
              rawValue={stats.totalPosts}
              icon={FileText}
              color="from-accent-light to-accent"
            />
          </div>

          <ChartSection chartData={chartData} />

          <MemberTable
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            sortedLength={sortedLength}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            paged={paged}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onBlock={handleBlock}
            onUnblock={handleUnblock}
          />
        </>
      </Skeleton>
    </div>
  );
}
