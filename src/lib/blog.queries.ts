import { queryOptions } from "@tanstack/react-query";
import { getPost, listPosts } from "./blog.functions";
export const postsQuery = () => queryOptions({ queryKey: ["blog", "published"], queryFn: () => listPosts() });
export const postQuery = (slug: string) => queryOptions({ queryKey: ["blog", slug], queryFn: () => getPost({ data: { slug } }) });
