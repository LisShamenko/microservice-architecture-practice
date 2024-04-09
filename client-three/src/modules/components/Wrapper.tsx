import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
// 
import { useStore } from "../../providers/RootStoreProvider";
import { queryPosts } from "../../stores/posts-store";
import { queryUpdateToken } from "../../stores/auth.store";



// 
export const Wrapper = observer(() => {

    const {
        postsStore: { getPostsAction, setPosts, posts, realPosts },
        authStore: { username, accessToken },
    } = useStore();

    const query1 = useQuery({
        queryKey: ['todos'],
        queryFn: queryPosts,
    });


    const { data, refetch } = useQuery({
        queryKey: ['update-token'],
        queryFn: async () => {
            return await queryUpdateToken(username, accessToken);
        },
        enabled: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        getPostsAction();
    }, []);

    return (
        <div>
            <h1>search params:</h1>
            <h2>username: {username}</h2>
            <h2>accessToken: {accessToken}</h2>
            <button onClick={() => refetch()}>Click me</button>
            <h1>LIST: query</h1>
            {query1.data?.map((p) => (<div key={p.id}>{p.title}</div>))}
            <h1>LIST: real posts</h1>
            {realPosts.map((p) => (<div key={p.id}>{p.title}</div>))}
            <h1>LIST: posts</h1>
            {posts?.case({
                pending: () => <div>loading</div>,
                rejected: () => <div>error</div>,
                fulfilled: (value) => <>
                    {value.map((p) => (<div key={p.id}>{p.title}</div>))}
                </>,
            })}
        </div>
    );
});
