import postsStore from "./posts-store";
import authStore from "./auth.store";



// 
export class RootStore {
    postsStore = postsStore;
    authStore = authStore;

    getState() {
        return {
            posts: this.postsStore,
            auth: this.authStore,
        }
    }
}

const store = new RootStore();
export default store;
