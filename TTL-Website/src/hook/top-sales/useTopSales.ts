"use client";

import { useState, useEffect } from "react";
import { profileService } from "@/service/profile.service";
import type { TopSalesResponse } from "@/service/api";

export function useTopSales() {
  const [data, setData] = useState<TopSalesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService
      .getTopSales()
      .then(setData)
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const members = data?.members ?? [];

  return { data, loading, members };
}
