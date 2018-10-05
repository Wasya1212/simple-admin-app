class AdminPanelTypes {
  constructor() {
    this.types = {};
    this.types_names = [];
  }

  get Types() {
    return this.types_names.join(',');
  }

  declareType(type_name, dom_view, options = {}) {
    if (typeof type_name !== 'string') {
      throw Error("Error declare new type: 'type name must be a String type!'");
    }
    if (!isNode(dom_view)) {
      throw Error("dom_view must be a DOM element");
    }

    let upperTypeName = type_name.toUpperCase();

    this.types[upperTypeName] = Object.create(null);

    this.types[upperTypeName].name = type_name;
    this.types[upperTypeName].renderer = dom_view;
    this.types_names.push(upperTypeName);

    // create an dom item in accordance with the type
    let dom_params = {
      classNames: options.classNames || [],
      id: options.id || '',
      beforeCreate: options.beforeCreate || function () {},
      afterCreate: options.afterCreate || function () {},
      getData: options.getData || function () {},
      setData: options.setData || function () {}
    };

    this.types[upperTypeName].createDOM = () => {
      dom_params.beforeCreate();

      let $_elementContainer = document.createElement('div');

      try {
        $_elementContainer.classList.add('admin-panel-element');
        $_elementContainer.id = dom_params.id;
        $_elementContainer.setAttribute('panelType', upperTypeName);
        $_elementContainer.appendChild(dom_view.cloneNode(true));

        dom_params.classNames.forEach(className => {
          $_elementContainer.classList.add(className);
        });
      } catch (err) {
        throw new Error(err);
      } finally {
        dom_params.afterCreate();
      }

      return {
        dom_view: $_elementContainer,
        getData: dom_params.getData,
        setData: dom_params.setData
      };
    }
  }

  checkType(type) {
    try {
      return this.types[type.name.toUpperCase()] ? true : false;
    } catch(err) {
      throw Error("Plese enter correct TYPE!");
    }
  }
}
