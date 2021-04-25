import * as th from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import Component from "./component";

export class LoadController extends Component {
    constructor() {
        super();

        this.textures_ = {};
        this.models_ = {};
    }

    LoadTexture(path, name) {
        if (!(name in this.textures_)) {
            const loader = new th.TextureLoader();
            loader.setPath(path);

            this.textures_[name] = {
                loader: loader,
                texture: loader.load(name),
            };
            this.textures_[name].encoding = THREE.sRGBEncoding;
        }

        return this.textures_[name].texture;
    }

    LoadGLTF(path, name, onLoad) {
        const loader = new GLTFLoader();
        loader.setPath(path);
        loader.load(
            name,
            onLoad,
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
                console.log(error);
            }
        );
    }

    LoadFBX(path, name, onLoad) {
        const loader = new FBXLoader();

        loader.setPath(path);
        loader.load(name, onLoad,(xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
            console.log(error);
        });
    }
}
