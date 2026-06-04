import { useState, useEffect } from "react";
import { postService } from "@/service/post.service";
import type { Post } from "@/types/post";

export function useNews() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setLoading(true);
      postService.getNews()
        .then((res: any) => {
          setPosts(res.posts);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return { posts, loading };
}
