export default class AdminScheme {
  constructor(name, getBaseData = done => done([])) {
    this.name = name;
    this.field = Object.create(null);
    this.operations = Object.create(null);
    this.getBaseData = getBaseData;
    this.fields = [];
  }

  addField(admin_type, name) {
    if (!name) {
      throw Error("Plese enter scheme name!");
    }

    this.field[name] = Object.create(null);

    this.field[name].value = null;
    this.field[name].title = name;
    this.field[name].type_name = admin_type.name;

    let {dom_view, getData, setData} = admin_type.createDOM();

    this.field[name].dom_view = dom_view;
    this.field[name].getData = getData;
    this.field[name].setData = setData;

    // this.field[name].validation = function() {
    //   this.dom_view.onChange(function(e) {
    //     this.value = this.type.getData();
    //   });
    //   validation(this.value, this.dom_view);
    // }
  }

  setData(options = {}) {
    this.fields = [];

    if (options.beforeCreate) {
      options.beforeCreate();
    }

    let getShemaData = new Promise((resolve, reject) => {
      this.getBaseData(resolve);
    });

    return getShemaData
      .then(data => {
        data.forEach(element => {
          let fullField = Object.assign({}, this.field);

          for (let field_name in fullField) {
            fullField[field_name] = Object.assign({}, fullField[field_name], {
              value: element[field_name] || 'NULL'
            });
          }

          this.fields.push(fullField);
        });

        if (options.afterCreate) {
          options.afterCreate(this.field);
        }

        return this.fields;
      });
  }

  addOperation(operation_name, options = {}, process_data = () => {}) {
    let fields = Object.assign({}, this.field);

    if (options.visible) {
      fields = {};
      options.visible.forEach(field => {
        fields[field] = this.field[field];
      }, this);
    }

    if (options.invisible) {
      options.invisible.forEach(field => {
        delete fields[field];
      });
    }

    if (options.unwritable) {
      options.unwritable.forEach(field => {
        fields[field].dom_view.classList.add('unwritable');
      });
    }

    Object.keys(fields).forEach(field => {
      let newDOM = fields[field].dom_view.cloneNode(true);

      fields[field] = Object.assign({}, fields[field], {
        dom_view: newDOM,
        getData: () => this.field[field].getData(newDOM),
        setData: data => this.field[field].setData(newDOM, data)
      });
    });

    let $_operation_section = document.createElement('div');
    $_operation_section.classList.add('operation-section');

    Object.keys(fields).forEach(field => {
      let $_field_container = document.createElement('div');
      $_field_container.classList.add('operation-section__field');

      let $_field_title = document.createElement('div');
      $_field_title.classList.add('operation-section__field-title');
      $_field_title.textContent = field;

      $_field_container.appendChild($_field_title);
      $_field_container.appendChild(fields[field].dom_view);

      $_operation_section.appendChild($_field_container);
    }, this);

    if (options.modal) {
      $_operation_section.classList.add('modal');
    }

    if (options.openText) {
      let $_operation_title = document.createElement('h4');
      $_operation_title.textContent = options.openText;
      $_operation_section.insertBefore($_operation_title, $_operation_section.firstChild);
    }

    this.operations[operation_name] = {
      getContainer() {
        return $_operation_section;
      },
      getFields() {
        return fields;
      },
      getData() {
        let data = Object.create(null);

        Object.keys(fields).forEach(field_name => {
          data[field_name] = fields[field_name].getData();
        });

        return data;
      },
      processData() {
        process_data(this.getData());
      },
      insertData(data) {
        Object.keys(data).forEach(field_name => {
          try {
            fields[field_name].setData(data[field_name]);
          } catch (e) {
            console.error(`Field '${field_name}' doesn't exists in ${operation_name} operation.`);
          }
        });
      },
      afterCreate: options.afterCreate || function() {}
    }

    let $_confirm_button = document.createElement('button');
    $_confirm_button.textContent = "Confirm";
    $_confirm_button.addEventListener('click', e => {
      e.preventDefault();
      this.operations[operation_name].processData();
    });

    $_operation_section.appendChild($_confirm_button);
  }

  use(operation_name) {
    if (!this.operations[operation_name]) {
      throw Error(`Operation ${operation_name} in ${this.name} scheme is not defined`);
    }

    return this.operations[operation_name].getFields();
  }
}
