# Poll Feed API Documentation

This document describes the new poll feed functionality added to the Votist application, including database models and API endpoints.

## Database Models

### Post

- `id`: Unique identifier (CUID)
- `title`: Post title
- `content`: Post content
- `authorId`: Reference to User (Clerk ID)
- `category`: Post category
- `tags`: Array of tags
- `likes`: Number of likes
- `isLiked`: Whether current user liked the post
- `isBookmarked`: Whether current user bookmarked the post
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Poll

- `id`: Unique identifier (CUID)
- `postId`: Reference to Post (one-to-one)
- `question`: Poll question
- `totalVotes`: Total number of votes
- `endsAt`: Poll end date (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### PollOption

- `id`: Unique identifier (CUID)
- `pollId`: Reference to Poll
- `text`: Option text
- `votes`: Number of votes for this option
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Comment

- `id`: Unique identifier (CUID)
- `content`: Comment content
- `authorId`: Reference to User (Clerk ID)
- `postId`: Reference to Post
- `parentId`: Reference to parent comment (for replies)
- `likes`: Number of likes
- `isLiked`: Whether current user liked the comment
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Vote

- `id`: Unique identifier (CUID)
- `userId`: Reference to User (Clerk ID)
- `postId`: Reference to Post
- `optionId`: Reference to PollOption
- `createdAt`: Creation timestamp

## API Endpoints

### Posts

#### GET /api/posts

Get all posts with pagination and filtering.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category

**Response:**

```json
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### POST /api/posts

Create a new post (requires authentication).

**Request Body:**

```json
{
	"title": "Post title",
	"content": "Post content",
	"category": "Category",
	"tags": ["tag1", "tag2"],
	"poll": {
		"question": "Poll question",
		"options": [{ "text": "Option 1" }, { "text": "Option 2" }],
		"endsAt": "2024-12-31T23:59:59Z"
	}
}
```

#### GET /api/posts/[id]

Get a specific post with all details.

#### PUT /api/posts/[id]

Update a post (requires authentication, owner or admin only).

#### DELETE /api/posts/[id]

Delete a post (requires authentication, owner or admin only).

### Comments

#### GET /api/posts/[id]/comments

Get comments for a specific post.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

#### POST /api/posts/[id]/comments

Create a new comment (requires authentication).

**Request Body:**

```json
{
	"content": "Comment content",
	"parentId": "parent-comment-id" // Optional, for replies
}
```

#### PUT /api/comments/[id]

Update a comment (requires authentication, owner or admin only).

#### DELETE /api/comments/[id]

Delete a comment (requires authentication, owner or admin only).

### Voting

#### POST /api/posts/[id]/vote

Vote on a poll option (requires authentication).

**Request Body:**

```json
{
	"optionId": "poll-option-id"
}
```

#### DELETE /api/posts/[id]/vote

Remove user's vote (requires authentication).

## Authentication

All endpoints that modify data require authentication using Clerk. The user's Clerk ID is used to identify the user in the database.

## Error Handling

All endpoints return consistent error responses:

```json
{
	"error": "Error message"
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found
- `500`: Internal server error

## Usage Examples

### Creating a Post with Poll

```javascript
const response = await fetch('/api/posts', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		title: "What's your favorite framework?",
		content: "I'm curious about your preferences...",
		category: 'Programming',
		tags: ['javascript', 'frameworks'],
		poll: {
			question: "What's your favorite framework?",
			options: [{ text: 'React' }, { text: 'Vue' }, { text: 'Svelte' }],
			endsAt: '2024-12-31T23:59:59Z'
		}
	})
});
```

### Voting on a Poll

```javascript
const response = await fetch(`/api/posts/${postId}/vote`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		optionId: 'option-id'
	})
});
```

### Adding a Comment

```javascript
const response = await fetch(`/api/posts/${postId}/comments`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		content: 'Great post! I agree with your points.'
	})
});
```

## Database Relationships

- **User** → **Post** (one-to-many): A user can create multiple posts
- **Post** → **Poll** (one-to-one): A post can have one poll
- **Poll** → **PollOption** (one-to-many): A poll can have multiple options
- **User** → **Vote** (one-to-many): A user can vote on multiple polls
- **Post** → **Comment** (one-to-many): A post can have multiple comments
- **Comment** → **Comment** (self-referencing): Comments can have replies
- **User** → **Comment** (one-to-many): A user can create multiple comments

## Security Features

1. **Authentication**: All write operations require user authentication
2. **Authorization**: Users can only modify their own content (posts, comments)
3. **Admin Override**: Admins can modify any content
4. **Vote Integrity**: Users can only vote once per poll, but can change their vote
5. **Cascade Deletes**: Deleting a post removes associated polls, comments, and votes
