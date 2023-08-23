import { CachedMedia } from "../types/cached_media";

export function get_media_in_store(): CachedMedia[] {
    let media = localStorage.getItem("media");
    return media != null ? JSON.parse(media) : [];
}

export function save_media_to_store(new_url: CachedMedia) {
    let media = get_media_in_store();
    media.push(new_url);
    console.log(media);
    localStorage.setItem("media", JSON.stringify(media));
}

export function delete_media_from_store(media: CachedMedia) {
    let lists_from_store = get_media_in_store();
    lists_from_store.splice(lists_from_store.indexOf(media), 1);
    localStorage.setItem("media", JSON.stringify(lists_from_store));
}

export function cleanup_media_from_store() {
    localStorage.setItem("media", "[]");    // An empty array that rappresent no media
}