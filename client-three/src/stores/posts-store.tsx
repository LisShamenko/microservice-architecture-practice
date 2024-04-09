import { makeAutoObservable, runInAction } from "mobx";
import { Posts, getPosts } from "../api/getPosts";
import { IPromiseBasedObservable, fromPromise } from "mobx-utils";



// 
class PostsStore {
    posts?: IPromiseBasedObservable<Posts[]>;
    realPosts: Posts[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    getPostsAction = () => {
        this.posts = fromPromise(getPosts());
    }

    setPosts = (posts: Posts[]) => {
        this.realPosts = posts;
    }
}

const postsStore = new PostsStore();
export default postsStore;

// 
export const queryPosts = async () => {
    const data = await getPosts();
    postsStore.setPosts(data);
    return data;
}
