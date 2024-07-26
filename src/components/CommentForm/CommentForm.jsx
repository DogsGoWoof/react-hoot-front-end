// src/components/CommentForm/CommentForm.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import * as hootService from '../../services/hootService';

import Icon from '../Icon/Icon';

import styles from './CommentForm.module.css';

const CommentForm = (props) => {
    const [formData, setFormData] = useState({ text: '' });

    const { hootId, commentId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchComment = async () => {
            const hootData = await hootService.show(hootId);
            // console.log(hootData);
            const commentData = hootData.comments.find((comment) => comment._id === commentId);
            // console.log(commentData);
            setFormData(commentData);
            // setFormData(hootData.comments.find((comment) => comment._id === commentId));
        };
        if (hootId && commentId) fetchComment();
    }, []);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    // console.log(hootId, commentId);

    // const handleSubmit = (evt) => {
    //     evt.preventDefault();
    //     // handleAddComment
    //     setFormData({ text: '' });
    // };
    // const handleSubmit = (evt) => {
    //     evt.preventDefault();
    //     props.handleAddComment(formData);
    //     setFormData({ text: '' });
    // };
    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (hootId && commentId) {
            hootService.updateComment(hootId, commentId, formData);
            navigate(`/hoots/${hootId}`);
        } else {
            props.handleAddComment(formData);
        }
        setFormData({ text: '' });
    };
    // New code:
    if (hootId && commentId) return (
        <main className={styles.container}>
            <form onSubmit={handleSubmit}>
                <h1>Edit Comment</h1>
                <label htmlFor="text-input">Your comment:</label>
                <textarea
                    required
                    type="text"
                    name="text"
                    id="text-input"
                    value={formData.text}
                    onChange={handleChange}
                />
                <button type="submit">SUBMIT</button>
            </form>
        </main>
    );

    // Existing return:
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="text-input">Your comment:</label>
            <textarea
                required
                type="text"
                name="text"
                id="text-input"
                value={formData.text}
                onChange={handleChange}
            />
            {/* <button type="submit">SUBMIT COMMENT</button> */}
            <button type="submit">
                <Icon category="Create" />
            </button>
        </form>
    );
};

export default CommentForm;
