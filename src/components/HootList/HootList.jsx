// src/components/HootList/HootList.jsx

import { Link } from 'react-router-dom';

import Icon from '../Icon/Icon';
import AuthorInfo from '../../components/AuthorInfo/AuthorInfo';

import styles from './HootList.module.css';

const HootList = (props) => {
    // return <main>Hoot List</main>;
    //     return (
    //         <main>
    //             {props.hoots.map((hoot) => (
    //                 <p key={hoot._id}>{hoot.title}</p>
    //             ))}
    //         </main>
    //     );
    return (
        // <main>
        <main className={styles.container}>
            {props.hoots.map((hoot) => (
                <Link key={hoot._id} to={`/hoots/${hoot._id}`}>
                    <article>
                        <header>
                            <div>
                                <h2>{hoot.title}</h2>
                                <Icon category={hoot.category} />
                            </div>
                            {/* <p> */}
                                {/* {hoot.author.username} posted on {new Date(hoot.createdAt).toLocaleDateString()} */}
                                <AuthorInfo content={hoot} />
                            {/* </p> */}
                        </header>
                        <p>{hoot.text}</p>
                    </article>
                </Link>
            ))}
        </main>
    );
};

export default HootList;