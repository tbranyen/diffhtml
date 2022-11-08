extern crate wee_alloc;

use js_sys::Reflect;
use tl::{Node, Parser};
use wasm_bindgen::prelude::*;
use js_sys::Array;
use js_sys::Object;

// Opt for a smaller allocator to save on resources.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Clone, Debug)]
#[wasm_bindgen(getter_with_clone)]
pub struct VTree {
    pub rawNodeName: String,
    pub nodeName: String,
    pub nodeValue: String,
    pub attributes: Object,
    pub childNodes: Array,
}

// Find properties, attributes, and children and populate into a VTree struct
// which is returned.
pub fn crawl_node(dom_node: &Node, parser: &Parser) -> VTree {
    let attributes = Object::new();
    let child_nodes = Array::new();
    let node_tag = dom_node.as_tag();
    let mut node_name = "#text".to_string();

    match node_tag {
        Some(htmlTag) => {
            // Set the node name
            node_name = htmlTag.name().as_utf8_str().to_string();

            // Add the attributes
            for attr in htmlTag.attributes().iter() {
                let key = attr.0.chars().as_str();
                let mut val = match attr.1 {
                    None => { "" }
                    Some(ref cowStr) => {
                        let varChar = cowStr.chars();

                        varChar.as_str()
                    }
                };

                Reflect::set(&attributes, &JsValue::from_str(key), &JsValue::from_str(val));
            }
        }
        None => {}
    }

    // Loop over the children and build them up into the child_nodes array.
    for inner_children in dom_node.children().iter() {
        for inner_node in inner_children.top().iter() {
            let v_tree = crawl_node(inner_node.get(parser).unwrap(), parser).clone();
            child_nodes.push(&JsValue::from(v_tree));
        }
    }

    VTree {
        rawNodeName: node_name.clone(),
        nodeName: node_name.clone(),
        nodeValue: node_name.clone(),
        childNodes: child_nodes,
        attributes,
    }
}

// Expose a single parse function. This takes in a string of HTML-like markup,
// parses it with the "tl" fast HTML parser, and then returns a struct tree
// representation expected by diffHTML.
#[no_mangle]
#[wasm_bindgen]
pub extern "C" fn parse(markup: &str) -> VTree {
    // Experiment with "tl" a zero-copy HTML parser. We may need to replace this
    // depending on its accuracy.
    let dom = tl::parse(markup, tl::ParserOptions::default()).unwrap();
    let parser = dom.parser();
    let child_nodes = Array::new();

    // Use the DOM and map into the VTree structure diffHTML expects.
    for dom_node in dom.children().iter() {
        let v_tree = crawl_node(dom_node.get(parser).unwrap(), parser);
        child_nodes.push(&JsValue::from(v_tree));
    }

    // Root node is always a document fragment.
    VTree {
        rawNodeName: "#document-fragment".to_string(),
        nodeName: "#document-fragment".to_string(),
        nodeValue: "".to_string(),
        childNodes: child_nodes,
        attributes: Object::new(),
    }
}
