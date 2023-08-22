import type { List } from "../types/list";

export function get_lists_from_store(): List[] {
    let list_raw = localStorage.getItem("list");
    return list_raw != null ? JSON.parse(list_raw) : [];    // Return empty list if nothing was found in store
}

export function add_list_to_store(new_list: List){
    let lists_from_store = get_lists_from_store();
    lists_from_store.push(new_list);
    localStorage.setItem("list", JSON.stringify(lists_from_store));
}

export function remove_list_from_store(new_list: List) {
    let lists_from_store = get_lists_from_store();

    lists_from_store.splice(lists_from_store.indexOf(new_list), 1);

    localStorage.setItem("list", JSON.stringify(lists_from_store));
}