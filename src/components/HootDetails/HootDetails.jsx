// src/components/HootDetails/HootDetails.jsx

import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthedUserContext } from '../../App';
import { useState, useEffect, useContext } from 'react';
import * as hootService from '../../services/hootService';

import CommentForm from '../CommentForm/CommentForm';

const HootDetails = (props) => {

    const [hoot, setHoot] = useState(null);

    const user = useContext(AuthedUserContext);

    const { hootId } = useParams();
    // console.log('hootId', hootId);

    useEffect(() => {
        const fetchHoot = async () => {
            const hootData = await hootService.show(hootId);
            // console.log('hootData', hootData);
            // console.log(hootData);
            setHoot(hootData);
        };
        fetchHoot();
    }, [hootId]);

    // const handleAddComment = async (commentFormData) => {
    //     console.log('commentFormData', commentFormData);
    // };
    const handleAddComment = async (commentFormData) => {
        const newComment = await hootService.createComment(hootId, commentFormData);
        // console.log(newComment);
        setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
    };

    const handleDeleteComment = async (hootId, commentId) => {
        // console.log(hootId);
        const deletedComment = await hootService.deleteComment(hootId.hootId, commentId);
        // console.log(deletedComment);
        const newCommentsArr = hoot.comments.filter((comment) => comment._id !== commentId);
        // setHoot({ ...hoot, comments: hoot.comments.filter((comment) => comment._id !== commentId) });
        setHoot({ ...hoot, comments: [...newCommentsArr] }); // use spread operator to assign new array to comments else TypeError occurs
        console.log(commentId);
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
                {hoot.author._id === user._id && (
                    <>
                        <Link to={`/hoots/${hootId}/edit`}>Edit</Link>
                        {/* <button>Delete</button> */}
                        <button onClick={() => props.handleDeleteHoot(hootId)}>Delete</button>
                    </>
                )}
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
                            {comment.author._id === user._id && (
                                <>
                                    <Link to={`/hoots/${hootId}/comments/${comment._id}/edit`}>Edit</Link>
                                    <button onClick={() => handleDeleteComment({hootId}, comment._id)}>Delete</button>
                                </>
                            )}
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