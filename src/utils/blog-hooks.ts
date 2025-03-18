import { useState, useEffect } from 'react';
import { BlogPost, getBlogPostBySlug, getBlogPosts, getBlogPostsByCategory } from '../services/contentful';

/**
 * Hook to fetch all blog posts
 */
export const useAllBlogPosts = (limit?: number) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getBlogPosts(limit);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [limit]);
  
  return { posts, isLoading, error };
};

/**
 * Hook to fetch a single blog post by slug
 */
export const useBlogPost = (slug: string | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }
    
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const fetchedPost = await getBlogPostBySlug(slug);
        setPost(fetchedPost);
        
        if (!fetchedPost) {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error(`Error fetching blog post with slug ${slug}:`, err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
  return { post, isLoading, error };
};

/**
 * Hook to fetch blog posts by category
 */
export const useBlogPostsByCategory = (category: string | null) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!category) {
      // If no category is specified, fetch all posts
      const fetchAllPosts = async () => {
        setIsLoading(true);
        try {
          const fetchedPosts = await getBlogPosts();
          setPosts(fetchedPosts);
        } catch (err) {
          console.error('Error fetching blog posts:', err);
          setError('Failed to load blog posts. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAllPosts();
      return;
    }
    
    const fetchPostsByCategory = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getBlogPostsByCategory(category);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error(`Error fetching blog posts for category ${category}:`, err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPostsByCategory();
  }, [category]);
  
  return { posts, isLoading, error };
};

/**
 * Hook to get featured blog posts
 */
export const useFeaturedBlogPosts = (count: number = 3) => {
  const { posts, isLoading, error } = useAllBlogPosts();
  
  // Sort posts by date and take the first 'count' ones
  const featuredPosts = posts.slice(0, count);
  
  return { featuredPosts, isLoading, error };
};

export default {
  useAllBlogPosts,
  useBlogPost,
  useBlogPostsByCategory,
  useFeaturedBlogPosts
};