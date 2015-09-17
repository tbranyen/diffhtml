import makeNode from '../node/make';
import makeElement from '../element/make';

/**
 * Takes in an element reference and resolve it to a uuid and DOM node.
 *
 * @param ref - Element descriptor
 * @return {Object} containing the uuid and DOM node.
 */
export default function get(ref) {
  let uuid = ref.element || ref;
  let element = makeNode.nodes[uuid] || makeElement(ref);

  return { element, uuid };
}
