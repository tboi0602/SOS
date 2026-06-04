import { useState, useEffect, useCallback } from "react";
import { lessonService } from "@/service/lesson.service";
import type { Lesson } from "@/types/content";

export function useAdminElearning() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetch = useCallback(() => {
    const id = setTimeout(() => {
      setLoading(true);
      lessonService
        .list(page, limit)
        .then((res) => {
          setLessons(res.lessons);
          setTotal(res.total);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 0);
    return id;
  }, [page]);

  useEffect(() => {
    const id = fetch();
    return () => clearTimeout(id);
  }, [fetch]);

  return {
    lessons,
    loading,
    page,
    total,
    totalPages: Math.ceil(total / limit),
    setPage,
    fetch,
  };
}
