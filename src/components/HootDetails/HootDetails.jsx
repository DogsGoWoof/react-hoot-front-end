// src/components/HootDetails/HootDetails.jsx

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as hootService from '../../services/hootService';

import CommentForm from '../CommentForm/CommentForm';

const HootDetails = (props) => {

    const [hoot, setHoot] = useState(null);

    const { hootId } = useParams();
    // console.log('hootId', hootId);

    useEffect(() => {
        const fetchHoot = async () => {
            const hootData = await hootService.show(hootId);
            // console.log('hootData', hootData);
            setHoot(hootData);
        };
        fetchHoot();
    }, [hootId]);

    // const handleAddComment = async (commentFormData) => {
    //     console.log('commentFormData', commentFormData);
    // };
    const handleAddComment = async (commentFormData) => {
        const newComment = await hootService.createComment(hootId, commentFormData);
        setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
    };

    // Verify that hoot state is being set correctly:
    // console.log('hoot state:', hoot);

    // return <main>Hoot Details</main>;
    if (!hoot) return <main>Loading...</main>;
    return (
        <main>
            <header>
                <p>{hoot.category.toUpperCase()}</p>
                <h1>{hoot.title}</h1>
                <p>
                    {hoot.author.username} posted on {new Date(hoot.createdAt).toLocaleDateString()}
                </p>
            </header>
            <p>{hoot.text}</p>
            {/* <section>
                <h2>Comments</h2>
            </section> */}
            <section>
                <h2>Comments</h2>

                {!hoot.comments.length && <p>There are no comments.</p>}

                {hoot.comments.map((comment) => (
                    <article key={comment._id}>
                        <header>
                            <p>
                                {comment.author.username} posted on {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                        </header>
                        <p>{comment.text}</p>
                    </article>
                ))}
            </section>
            <h2>Comments</h2>
            <CommentForm handleAddComment={handleAddComment} />
        </main>
    );
};

export default HootDetails;