import {Episodes} from "../responses/Episodes";
import {Info} from "../responses/Info";

export interface RickAndMortyAPI {
    info ?: Info,
    results: Episodes[]
}