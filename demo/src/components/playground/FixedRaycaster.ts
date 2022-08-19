import * as THREE from "three";

import { getAttributeScale, getSkinnedVertex } from "../../../../packages/view3d/src/utils";

const _inverseMatrix = new THREE.Matrix4();
const _ray = new THREE.Ray();
const _sphere = new THREE.Sphere();

const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vC = new THREE.Vector3();

const _uvA = new THREE.Vector2();
const _uvB = new THREE.Vector2();
const _uvC = new THREE.Vector2();

const _intersectionPoint = new THREE.Vector3();
const _intersectionPointWorld = new THREE.Vector3();

class FixedRaycaster {
  private _raycaster: THREE.Raycaster;

  public constructor() {
    this._raycaster = new THREE.Raycaster();
  }

  public setFromCamera(pointer: THREE.Vector2, camera: THREE.Camera) {
    this._raycaster.setFromCamera(pointer, camera);
  }

  public intersectObject(object: THREE.Object3D): THREE.Intersection[] {
    const intersects: THREE.Intersection[] = [];

    this._intersectObject(object, intersects);
    intersects.sort((a, b) => a.distance - b.distance);

    return intersects;
  }

  // Original code from three.js#r134 Raycaster#intersectObject
  // Modified for Meshopt support
  // https://github.com/mrdoob/three.js/blob/00a692864f541a3ec194d266e220efd597eb28fa/src/core/Raycaster.js#L88
  private _intersectObject(object: THREE.Object3D, intersects: THREE.Intersection[]) {
    const raycaster = this._raycaster;

    if (object.layers.test(raycaster.layers)) {
      if ((object as THREE.Mesh).isMesh) {
        this._raycast(object as THREE.Mesh, raycaster, intersects);
      } else {
        object.raycast(raycaster, intersects);
      }
    }

    const children = object.children;

    for ( let i = 0, l = children.length; i < l; i ++ ) {
      this._intersectObject(children[ i ], intersects);
    }
  }

  // Original code from three.js#r134 Mesh#raycast
  // Modified for Meshopt support
  // https://github.com/mrdoob/three.js/blob/00a692864f541a3ec194d266e220efd597eb28fa/src/objects/Mesh.js#L118
  private _raycast(obj: THREE.Mesh, raycaster: THREE.Raycaster, intersects: THREE.Intersection[]) {
    const geometry = obj.geometry;
    const material = obj.material;
    const matrixWorld = obj.matrixWorld;

    if ( material === undefined ) return;

    // Checking boundingSphere distance to ray

    if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

    _sphere.copy(geometry.boundingSphere!);
    _sphere.applyMatrix4(matrixWorld);

    if (raycaster.ray.intersectsSphere( _sphere ) === false) return;

    //
    _inverseMatrix.copy(matrixWorld).invert();

    _ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);

    // Check boundingBox before continuing
    if (geometry.boundingBox !== null) {
      if (_ray.intersectsBox(geometry.boundingBox) === false) return;
    }

    let intersection;

    if (geometry.isBufferGeometry) {
      const index = geometry.index;
      const position = geometry.attributes.position;
      const morphPosition = geometry.morphAttributes.position;
      const morphTargetsRelative = geometry.morphTargetsRelative;
      const uv = geometry.attributes.uv;
      const uv2 = geometry.attributes.uv2;
      const groups = geometry.groups;
      const drawRange = geometry.drawRange;

      _ray.copy(raycaster.ray);

      if (index !== null) {
        // indexed buffer geometry
        if (Array.isArray(material)) {
          for (let i = 0, il = groups.length; i < il; i++) {
            const group = groups[i];
            const groupMaterial = material[group.materialIndex!];

            const start = Math.max(group.start, drawRange.start);
            const end = Math.min(index.count, Math.min((group.start + group.count), (drawRange.start + drawRange.count)));

            for (let j = start, jl = end; j < jl; j += 3) {
              const a = index.getX(j);
              const b = index.getX(j + 1);
              const c = index.getX(j + 2);

              intersection = this._checkBufferGeometryIntersection(obj, groupMaterial, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

              if (intersection) {
                intersection.faceIndex = Math.floor(j / 3); // triangle number in indexed buffer semantics
                intersection.face.materialIndex = group.materialIndex;
                intersects.push(intersection);
              }
            }
          }
        } else {
          const start = Math.max(0, drawRange.start);
          const end = Math.min(index.count, (drawRange.start + drawRange.count));

          for (let i = start, il = end; i < il; i += 3) {
            const a = index.getX(i);
            const b = index.getX(i + 1);
            const c = index.getX(i + 2);

            intersection = this._checkBufferGeometryIntersection(obj, material, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

            if (intersection) {
              intersection.faceIndex = Math.floor(i / 3); // triangle number in indexed buffer semantics
              intersects.push(intersection);
            }
          }
        }
      } else if (position !== undefined) {
        // non-indexed buffer geometry
        if (Array.isArray(material)) {
          for (let i = 0, il = groups.length; i < il; i++) {
            const group = groups[i];
            const groupMaterial = material[group.materialIndex!];

            const start = Math.max(group.start, drawRange.start);
            const end = Math.min(position.count, Math.min((group.start + group.count), (drawRange.start + drawRange.count)));

            for (let j = start, jl = end; j < jl; j += 3) {
              const a = j;
              const b = j + 1;
              const c = j + 2;

              intersection = this._checkBufferGeometryIntersection(obj, groupMaterial, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

              if (intersection) {
                intersection.faceIndex = Math.floor(j / 3); // triangle number in non-indexed buffer semantics
                intersection.face.materialIndex = group.materialIndex;
                intersects.push(intersection);
              }
            }
          }
        } else {
          const start = Math.max(0, drawRange.start);
          const end = Math.min(position.count, (drawRange.start + drawRange.count));

          for (let i = start, il = end; i < il; i += 3) {
            const a = i;
            const b = i + 1;
            const c = i + 2;

            intersection = this._checkBufferGeometryIntersection(obj, material, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

            if (intersection) {
              intersection.faceIndex = Math.floor(i / 3); // triangle number in non-indexed buffer semantics
              intersects.push(intersection);
            }
          }
        }
      }
    }
  }

  private _checkBufferGeometryIntersection(object: THREE.Mesh, material: THREE.Material, raycaster: THREE.Raycaster, ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c) {
    if ((object as THREE.SkinnedMesh).isSkinnedMesh) {
      const skinned = object as THREE.SkinnedMesh;
      const skinWeight = skinned.geometry.attributes.skinWeight;

      const positionScale = getAttributeScale(position);
      const skinWeightScale = getAttributeScale(skinWeight);

      _vA.copy(getSkinnedVertex(a, skinned, positionScale, skinWeightScale));
      _vB.copy(getSkinnedVertex(b, skinned, positionScale, skinWeightScale));
      _vC.copy(getSkinnedVertex(c, skinned, positionScale, skinWeightScale));
    } else {
      _vA.fromBufferAttribute(position, a).applyMatrix4(object.matrixWorld);
      _vB.fromBufferAttribute(position, b).applyMatrix4(object.matrixWorld);
      _vC.fromBufferAttribute(position, c).applyMatrix4(object.matrixWorld);
    }

    const intersection = this._checkIntersection(object, material, raycaster, ray, _vA, _vB, _vC, _intersectionPoint);

    if (intersection) {
      if (uv) {
        _uvA.fromBufferAttribute(uv, a);
        _uvB.fromBufferAttribute(uv, b);
        _uvC.fromBufferAttribute(uv, c);

        intersection.uv = THREE.Triangle.getUV(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new THREE.Vector2());
      }

      if (uv2) {
        _uvA.fromBufferAttribute(uv2, a);
        _uvB.fromBufferAttribute(uv2, b);
        _uvC.fromBufferAttribute(uv2, c);

        (intersection as any).uv2 = THREE.Triangle.getUV(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new THREE.Vector2());
      }

      const face = {
        a: a,
        b: b,
        c: c,
        normal: new THREE.Vector3(),
        materialIndex: 0
      };

      THREE.Triangle.getNormal(_vA, _vB, _vC, face.normal);
      intersection.face = face;
    }

    return intersection;
  }

  private _checkIntersection(object: THREE.Mesh, material: THREE.Material, raycaster: THREE.Raycaster, ray: THREE.Ray, pA: THREE.Vector3, pB: THREE.Vector3, pC: THREE.Vector3, point: THREE.Vector3): THREE.Intersection | null {
    let intersect: THREE.Vector3 | null;

    if (material.side === THREE.BackSide) {
      intersect = ray.intersectTriangle(pC, pB, pA, true, point);
    } else {
      intersect = ray.intersectTriangle(pA, pB, pC, material.side !== THREE.DoubleSide, point);
    }

    if (intersect === null) return null;

    _intersectionPointWorld.copy(point);

    const distance = raycaster.ray.origin.distanceTo(_intersectionPointWorld);

    if (distance < raycaster.near || distance > raycaster.far) return null;

    return {
      distance: distance,
      point: _intersectionPointWorld.clone(),
      object: object
    };
  }
}

export default FixedRaycaster;
