import { load } from 'js-yaml'
import { readFileSync } from 'node:fs'

export function loadYaml(fn) {
    return load(readFileSync(fn))
}