export default class AdminPanelTypes {
  constructor() {
    this.types = {};
    this.types_names = [];
  }

  // get all AdminPanelTypes types in string format
  get Types() {
    return this.types_names.join(',');
  }

  // used for creating new type
  declareType(type_name, dom_view, options = {}) {
    if (typeof type_name !== 'string') {
      throw Error("Error declare new type: 'type name must be a String type!'");
    }
    if (!isNode(dom_view())) {
      throw Error("dom_view must be a DOM element");
    }

    // all types is uppercase
    let upperTypeName = type_name.toUpperCase();

    this.types[upperTypeName] = Object.create(null);
    this.types[upperTypeName].name = type_name;
    this.types[upperTypeName].renderer = dom_view;
    this.types_names.push(upperTypeName);

    // create an dom item in accordance with the type
    let dom_params = {
      classNames: options.classNames || [],
      beforeCreate: options.beforeCreate || function () {},
      afterCreate: options.afterCreate || function () {},
      getData: options.getData || function () {},
      setData: options.setData || function () {}
    };

    /*
      used for creating controlled
      element by this type for renderer
    */
    this.types[upperTypeName].createDOM = () => {
      dom_params.beforeCreate();

      let $_elementContainer = document.createElement('div'); // container for type DOM
      let readyDOM = Object.create(null);

      try {
        $_elementContainer.classList.add('admin-panel-element');
        $_elementContainer.setAttribute('panelType', upperTypeName);
        $_elementContainer.appendChild(this.types[upperTypeName].renderer().cloneNode(true));

        dom_params.classNames.forEach(className => {
          $_elementContainer.classList.add(className);
        });

        readyDOM = {
          dom_view: $_elementContainer,
          getData: () => dom_params.getData($_elementContainer),
          setData: data => {
            dom_params.setData(data, $_elementContainer);
          }
        };
      } catch (err) {
        throw new Error(err);
      } finally {
        dom_params.afterCreate(readyDOM);
      }

      return readyDOM;
    }
  }

  // check if some type realy in AdminPanelTypes
  checkType(type) {
    try {
      return this.types[type.name.toUpperCase()] ? true : false;
    } catch(err) {
      throw Error("Plese enter correct TYPE!");
    }
  }
}

function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node :
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}
