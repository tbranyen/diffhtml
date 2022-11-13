extern crate wasm_bindgen;

use tl::{Node, Parser};
use wasm_bindgen::{prelude::*};
use js_sys::{Reflect};
use js_sys::Array;
use js_sys::Object;
use std::cell::RefCell;
use std::collections::HashMap;

struct Cache {
    entries: RefCell<HashMap<String, JsValue>>,
}

thread_local! {
    static CACHE: Cache = Cache {
        entries: RefCell::new(HashMap::new()),
    };
}

#[wasm_bindgen(getter_with_clone)]
pub struct VTree {
    pub rawNodeName: Option<String>,
    pub nodeName: Option<String>,
    pub nodeValue: Option<String>,
    pub attributes: Object,
    pub childNodes: Array,
}

// Caches and reuses a given JsValue from a string reference.
fn intern_and_return_cached(input_str: &str) -> JsValue {
    CACHE.with(|cache| {
        let mut cache = cache.entries.borrow_mut();

        if !cache.contains_key(input_str) {
            cache.insert(input_str.to_owned(), JsValue::from(input_str));
        }

        cache.get(input_str).into()
    })
}


// Find properties, attributes, and children and populate into a VTree struct
// which is returned.
pub fn crawl_node(dom_node: &Node, parser: &Parser) -> VTree {
    let attributes = Object::new();
    let child_nodes = Array::new();
    let node_tag = dom_node.as_tag();
    let mut node_name = intern_and_return_cached("#text");
    let mut node_value = intern_and_return_cached("");

    match node_tag {
        Some(html_tag) => {
            let tag_name = html_tag.name().as_utf8_str();
            node_name = intern_and_return_cached(tag_name.trim());

            // Add the attributes
            for attr in html_tag.attributes().iter() {
                let key = attr.0.chars().as_str();
                let value = match attr.1 {
                    None => { "" }
                    Some(ref cow_str) => {
                        cow_str.chars().as_str()
                    }
                };

                // Cache the JsValue internally and replace when injecting over-the-wire.
                let keyJS = intern_and_return_cached(key);
                let valueJS = intern_and_return_cached(value);

                Reflect::set(&attributes, &keyJS, &valueJS);
            }
        }
        None => {
            node_value = intern_and_return_cached(dom_node.inner_text(parser).to_string().as_str());
        }
    }

    // Loop over the children and build them up into the child_nodes array.
    for inner_children in dom_node.children().iter() {
        for inner_node in inner_children.top().iter() {
            let v_tree = crawl_node(inner_node.get(parser).unwrap(), parser);
            child_nodes.push(&JsValue::from(v_tree));
        }
    }

    VTree {
        rawNodeName: node_name.as_string(),
        nodeName: node_name.as_string(),
        nodeValue: node_value.as_string(),
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
    let fragment_name = intern_and_return_cached("#document-fragment");

    // Use the DOM and map into the VTree structure diffHTML expects.
    for dom_node in dom.children().iter() {
        let v_tree = crawl_node(dom_node.get(parser).unwrap(), parser);
        child_nodes.push(&JsValue::from(v_tree));
    }

    // Root node is always a document fragment.
    VTree {
        rawNodeName: fragment_name.as_string(),
        nodeName: fragment_name.as_string(),
        nodeValue: intern_and_return_cached("").as_string(),
        childNodes: child_nodes,
        attributes: Object::new(),
    }
}