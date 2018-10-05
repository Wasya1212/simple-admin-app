class AdminPanelController {
  constructor($_container) {
    // parent element for all contoller DOM elements
    this.$_container = $_container;

    this.$_schema_container = document.createElement('section');
    this.$_data_container = document.createElement('section');
    this.$_operations_container = document.createElement('aside');

    this.$_container.appendChild(this.$_schema_container);
    this.$_container.appendChild(this.$_data_container);
    this.$_container.appendChild(this.$_operations_container);

    // create control input types
    this.types = new AdminPanelTypes();

    let STRING_VIEW = data => {
      return document.createElement('input');
    }

    this.types.declareType('String', STRING_VIEW(), {
      getData: container => {
        let $_data_container = container.querySelector('input');
        let data = $_data_container.value;
        // console.log(data);
        return data || null;
      },
      setData: (container, data) => {
        let $_data_container = container.querySelector('input');
        $_data_container.value = data;
      }
    });
    this.types.declareType('Text', STRING_VIEW(), {
      getData: data_container => {
        alert(data_container);
      }
    });
    this.types.declareType('Check', STRING_VIEW());
    this.types.declareType('MultiCheck', STRING_VIEW());
    this.types.declareType('File', STRING_VIEW());
    this.types.declareType('MultiFile', STRING_VIEW());
    this.types.declareType('Baseobj', STRING_VIEW());

    this.schemes = [];
    this.scheme = Object.create(null);
  }

  addScheme(scheme_name, scheme_fields = {}, baseData) {
    if (!scheme_name) {
      throw Error("Plese enter scheme name");
    };

    this.scheme[scheme_name] = new AdminScheme(scheme_name, baseData);

    for (let field in scheme_fields) {
      if (!this.types.checkType(scheme_fields[field].type)) {
        throw Error("Field type not declareted in admin panel!");
      }
      this.scheme[scheme_name].addField(scheme_fields[field].type, field);
    }

    return this.scheme[scheme_name];
  }

  get Types() {
    return this.types.types;
  }

  init() {
    let $_shemes_menu = this.buildSidePanel();
    let $_schema_data = this.buildSchemaDataTable(this.Schemes['characters']);
    let $_schema_operations = this.buildOperationsPanel(this.Schemes['characters']);

    this.$_schema_container.appendChild($_shemes_menu);
    this.$_data_container.appendChild($_schema_data);
    this.$_operations_container.appendChild($_schema_operations);
  }

  buildSidePanel() {
    let $_schemes_panel = document.createElement('nav');
    $_schemes_panel.classList.add('admin-schemes');

    Object.keys(this.Schemes).forEach(scheme => {
      let $_scheme_switcher = document.createElement('li');
      $_scheme_switcher.textContent = scheme;
      $_scheme_switcher.addEventListener('click', e => {
        this.clearContainer(this.$_data_container);
        this.$_data_container.appendChild(this.buildSchemaDataTable(this.Schemes[scheme]));
      });

      $_schemes_panel.appendChild($_scheme_switcher);
    });

    return $_schemes_panel;
  }

  buildOperationsPanel(schema) {
    let $_operations_panel = document.createElement('ul');
    $_operations_panel.classList.add('admin-schemes');

    for (let operation_key in schema.operations) {
      let $_operation_block = document.createElement('li');
      $_operation_block.textContent = operation_key;
      $_operation_block.addEventListener('click', e => {
        e.preventDefault();

        this.clearContainer(this.$_data_container);
        this.$_data_container.appendChild(schema.operations[operation_key].getContainer());
        schema.operations[operation_key].afterCreate(schema.operations[operation_key]);
      });

      $_operations_panel.appendChild($_operation_block);
    }

    return $_operations_panel;
  }

  buildSchemaDataTable(schema) {
    let $_data_grid = document.createElement('table');
    let $_data_grid_items_title_container = document.createElement('tr');

    $_data_grid.classList.add('database-view');

    for (let key in schema.field) {
      let $_data_grid_item_title = document.createElement('th');
      $_data_grid_item_title.classList.add('database-item-title');
      $_data_grid_item_title.textContent = key.toString();

      $_data_grid_items_title_container.appendChild($_data_grid_item_title);
    }

    $_data_grid.appendChild($_data_grid_items_title_container);

    schema.setData()
      .then(fields => {
        fields.forEach(field => {
          let $_data_grid_items_container = document.createElement('tr');

          for (let key in field) {
            let $_data_grid_item = document.createElement('td');
            $_data_grid_item.classList.add('database-item');

            let $_grid_item_column = document.createElement('span');
            $_grid_item_column.classList.add('database-item-column');
            $_grid_item_column.textContent = JSON.stringify(field[key].value);

            $_data_grid_item.appendChild($_grid_item_column);

            $_data_grid_items_container.appendChild($_data_grid_item);
          }

          $_data_grid.appendChild($_data_grid_items_container);
        });
      });

    return $_data_grid;
  }

  clearContainer(container) {
    container.innerHTML = '';
  }

  get Schemes() {
    return this.scheme;
  }
}

function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node :
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}
