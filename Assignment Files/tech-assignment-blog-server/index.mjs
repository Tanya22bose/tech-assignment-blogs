/**
 * @fileoverview A simple Express.js server for managing blog posts with endpoints for retrieving posts,
 * paginated posts, posts by category, and converting post content to HTML.
 */

import express from "express";
import cors from "cors";
import posts from "./data/posts.json" assert { type: "json" };

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("static"));

/**
 * GET /categories
 * Retrieves all unique categories from the posts.
 *
 * @name GetAllCategories
 * @route {GET} /categories
 * @returns {Object[]} 200 - An array of unique categories.
 * @returns {Object} 500 - An error message if the categories cannot be loaded.
 *
 * @example
 * // Example response:
 * [
 *   "Technology",
 *   "Scam Alert",
 *   "Lifestyle",
 *   "Health"
 * ]
 */
app.get("/categories", async (req, res) => {
  try {
    // Extract unique categories
    const categories = [
      ...new Set(posts.map((post) => post.category || "Uncategorized")),
    ];

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to load categories" });
  }
});

/**
 * GET /posts/page/:page
 * Retrieves paginated blog posts.
 *
 * @name GetPaginatedPosts
 * @route {GET} /posts/page/:page
 * @param {number} req.params.page - The page number to retrieve.
 * @returns {Object} 200 - An object containing paginated posts, total posts, and total pages.
 * @returns {Object} 500 - An error message if the paginated posts cannot be loaded.
 * @example
 * // Example response:
 * {
 *   "page": 1,
 *   "limit": 20,
 *   "totalPosts": 40,
 *   "totalPages": 2,
 *   "posts": [
 *     {
 *       "id": "1",
 *       "uid": "post-1",
 *       "title": "First Blog Post",
 *       "description": "This is the first blog post.",
 *       "category": "Technology",
 *       "author": "John Doe",
 *       "author_image": "http://localhost:3000/images/author1.jpg",
 *       "featured_image": "http://localhost:3000/images/featured1.jpg",
 *       "first_publication_date": "2024-03-08T13:07:03+0000",
 *       "last_publication_date": "2024-03-08T13:07:03+0000"
 *     },
 *     {
 *       "id": "2",
 *       "uid": "post-2",
 *       "title": "Second Blog Post",
 *       "description": "This is the second blog post.",
 *       "category": "Technology",
 *       "author": "Jane Smith",
 *       "author_image": "http://localhost:3000/images/author2.jpg",
 *       "featured_image": "http://localhost:3000/images/featured2.jpg",
 *       "first_publication_date": "2024-03-08T13:07:03+0000",
 *       "last_publication_date": "2024-03-08T13:07:03+0000"
 *     }
 *   ]
 * }
 * }
 */

app.get("/posts/page/:page", async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedPosts = posts.slice(startIndex, endIndex).map((post) => {
      delete post.html;
      return post;
    });

    res.json({
      page,
      limit,
      totalPosts: posts.length,
      totalPages: Math.ceil(posts.length / limit),
      posts: paginatedPosts,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load paginated posts" });
  }
});

/**
 * GET /posts/category/:category/page/:page
 * Retrieves paginated blog posts filtered by category.
 *
 * @name GetPaginatedPostsByCategory
 * @route {GET} /posts/category/:category/page/:page
 * @param {string} req.params.category - The category to filter posts by.
 * @param {number} req.params.page - The page number to retrieve.
 * @returns {Object} 200 - An object containing paginated posts, total posts, and total pages for the specified category.
 * @returns {Object} 500 - An error message if the paginated category posts cannot be loaded.
 *
 * @example
 * // Example response:
 * {
 *   "category": "technology",
 *   "page": 1,
 *   "limit": 20,
 *   "totalPosts": 40,
 *   "totalPages": 2,
 *   "posts": [
 *     {
 *       "id": "1",
 *       "uid": "post-1",
 *       "title": "First Blog Post",
 *       "description": "This is the first blog post.",
 *       "category": "Technology",
 *       "author": "John Doe",
 *       "author_image": "http://localhost:3000/images/author1.jpg",
 *       "featured_image": "http://localhost:3000/images/featured1.jpg",
 *       "first_publication_date": "2024-03-08T13:07:03+0000",
 *       "last_publication_date": "2024-03-08T13:07:03+0000"
 *     },
 *     {
 *       "id": "2",
 *       "uid": "post-2",
 *       "title": "Second Blog Post",
 *       "description": "This is the second blog post.",
 *       "category": "Technology",
 *       "author": "Jane Smith",
 *       "author_image": "http://localhost:3000/images/author2.jpg",
 *       "featured_image": "http://localhost:3000/images/featured2.jpg",
 *       "first_publication_date": "2024-03-08T13:07:03+0000",
 *       "last_publication_date": "2024-03-08T13:07:03+0000"
 *     }
 *   ]
 * }
 */
app.get("/posts/category/:category/page/:page", async (req, res) => {
  try {
    const category = req.params.category;
    const page = req.params.page || 1; // Default page is 1
    const limit = 20;

    // Filter posts by category
    const filteredPosts = posts.filter((post) => post.category === category);

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Response
    res.json({
      category,
      page,
      limit,
      totalPosts: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit),
      posts: paginatedPosts.map((post) => {
        delete post.html;
        return post;
      }),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load paginated category posts" });
  }
});

/**
 * GET /posts/:id
 * Retrieves a single blog post by ID and converts its body content to HTML.
 *
 * @name GetPostById
 * @route {GET} /posts/:id
 * @param {string} req.params.id - The ID of the post to retrieve.
 * @returns {Object} 200 - An object containing the post metadata and its body content as HTML.
 * @returns {Object} 404 - An error message if the post is not found.
 * @returns {Object} 500 - An error message if the post cannot be converted to HTML.
 *
 * @example
 * // Example response:
 * {
 *   "id": "1",
 *   "uid": "post-1",
 *   "title": "First Blog Post",
 *   "description": "This is the first blog post.",
 *   "category": "Technology",
 *   "author": "John Doe",
 *   "author_image": "http://localhost:3000/images/author1.jpg",
 *   "featured_image": "http://localhost:3000/images/featured1.jpg",
 *   "first_publication_date": "2024-03-08T13:07:03+0000",
 *   "last_publication_date": "2024-03-08T13:07:03+0000",
 *   "html": "<h1>First Blog Post</h1><p>This is the content of the first blog post.</p>"
 * }
 */
app.get("/posts/:id", async (req, res) => {
  try {
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ ...post, html: JSON.stringify(post.html) });
  } catch (error) {
    res.status(500).json({ error: "Failed to convert post to HTML" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
