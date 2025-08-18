<script lang="ts">
	import DiscussionHeader from './DiscussionHeader.svelte';
	import CommentForm from './CommentForm.svelte';
	import DiscussionComment from './DiscussionComment.svelte';

	// Mock data for discussions
	let discussions = [
		{
			id: 1,
			content:
				'I think we need to consider the infrastructure impact before approving more housing. Our roads and schools are already at capacity.',
			author: {
				name: 'Sarah Chen',
				votingPower: 15
			},
			timestamp: '2024-01-15T10:30:00Z',
			votes: 8,
			hasVoted: false,
			userVote: null,
			depth: 0,
			replies: [
				{
					id: 2,
					content:
						"That's a valid concern, but we could use impact fees from new developments to fund infrastructure improvements.",
					author: {
						name: 'Mike Rodriguez',
						votingPower: 12
					},
					timestamp: '2024-01-15T11:15:00Z',
					votes: 5,
					hasVoted: false,
					userVote: null,
					depth: 1,
					replies: [
						{
							id: 3,
							content:
								"Impact fees rarely cover the full cost though. We've seen this pattern in other cities.",
							author: {
								name: 'Dr. Lisa Park',
								votingPower: 20
							},
							timestamp: '2024-01-15T12:00:00Z',
							votes: 3,
							hasVoted: false,
							userVote: null,
							depth: 2,
							replies: []
						}
					]
				}
			]
		},
		{
			id: 4,
			content:
				"We should focus on affordable housing specifically. Market-rate housing won't solve our affordability crisis.",
			author: {
				name: 'James Wilson',
				votingPower: 18
			},
			timestamp: '2024-01-15T09:45:00Z',
			votes: 12,
			hasVoted: false,
			userVote: null,
			depth: 0,
			replies: [
				{
					id: 5,
					content: 'Agreed! We need inclusionary zoning requirements for all new developments.',
					author: {
						name: 'Maria Gonzalez',
						votingPower: 14
					},
					timestamp: '2024-01-15T10:00:00Z',
					votes: 7,
					hasVoted: false,
					userVote: null,
					depth: 1,
					replies: []
				}
			]
		},
		{
			id: 6,
			content:
				'Has anyone considered the environmental impact? More housing means more cars and more strain on our natural resources.',
			author: {
				name: 'Alex Thompson',
				votingPower: 10
			},
			timestamp: '2024-01-15T08:30:00Z',
			votes: 4,
			hasVoted: false,
			userVote: null,
			depth: 0,
			replies: []
		}
	];

	let totalComments = 0;

	// Calculate total comments including replies
	function calculateTotalComments(comments: any[]): number {
		let total = 0;
		for (const comment of comments) {
			total += 1;
			if (comment.replies && comment.replies.length > 0) {
				total += calculateTotalComments(comment.replies);
			}
		}
		return total;
	}

	$: totalComments = calculateTotalComments(discussions);

	function handleNewComment(event: CustomEvent<{ content: string; parentId: number | null }>) {
		const { content } = event.detail;

		// Create new comment
		const newComment = {
			id: Date.now(),
			content,
			author: {
				name: 'You',
				votingPower: 8
			},
			timestamp: new Date().toISOString(),
			votes: 0,
			hasVoted: false,
			userVote: null,
			depth: 0,
			replies: []
		};

		// Add to discussions
		discussions = [newComment, ...discussions];
	}

	function handleCommentVote(event: CustomEvent<{ commentId: number; voteType: 'up' | 'down' }>) {
		const { commentId, voteType } = event.detail;

		// Find and update the comment (this would normally be an API call)
		function updateCommentVote(comments: any[]): any[] {
			return comments.map((comment) => {
				if (comment.id === commentId) {
					return {
						...comment,
						votes: comment.votes + (voteType === 'up' ? 1 : -1),
						hasVoted: true,
						userVote: voteType
					};
				}
				if (comment.replies && comment.replies.length > 0) {
					return {
						...comment,
						replies: updateCommentVote(comment.replies)
					};
				}
				return comment;
			});
		}

		discussions = updateCommentVote(discussions);
	}

	function handleCommentReply(event: CustomEvent<{ parentId: number; content: string }>) {
		const { parentId, content } = event.detail;

		// Create new reply
		const newReply = {
			id: Date.now(),
			content,
			author: {
				name: 'You',
				votingPower: 8
			},
			timestamp: new Date().toISOString(),
			votes: 0,
			hasVoted: false,
			userVote: null,
			depth: 0, // Will be set when added to parent
			replies: []
		};

		// Find parent and add reply
		function addReplyToComment(comments: any[], depth: number = 0): any[] {
			return comments.map((comment) => {
				if (comment.id === parentId) {
					return {
						...comment,
						replies: [...(comment.replies || []), { ...newReply, depth: depth + 1 }]
					};
				}
				if (comment.replies && comment.replies.length > 0) {
					return {
						...comment,
						replies: addReplyToComment(comment.replies, depth + 1)
					};
				}
				return comment;
			});
		}

		discussions = addReplyToComment(discussions);
	}
</script>

<div class="mt-8 border-t border-gray-200 pt-8">
	<DiscussionHeader {totalComments} />

	<!-- New Comment Form -->
	<CommentForm placeholder="Share your thoughts on this proposal..." on:submit={handleNewComment} />

	<!-- Discussion Comments -->
	<div class="space-y-4">
		{#each discussions as comment}
			<DiscussionComment {comment} on:vote={handleCommentVote} on:reply={handleCommentReply} />
		{/each}
	</div>

	{#if discussions.length === 0}
		<div class="py-12 text-center text-gray-500">
			<p class="mb-2">No comments yet.</p>
			<p class="text-sm">Be the first to share your thoughts on this proposal!</p>
		</div>
	{/if}
</div>
