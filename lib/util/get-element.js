import makeNode from '../node/make';
import makeElement from '../element/make';

/**
 * getElement
 *
 * @param ref
 * @return
 */
export default function getElement(ref) {
  var uuid = ref.element || ref;
  var element = makeNode.nodes[uuid] || makeElement(ref);

  return { element, uuid };
}
