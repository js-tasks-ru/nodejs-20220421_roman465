const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    const ruleForName = {
      type: 'string',
      min: 10,
      max: 20,
    };

    const ruleForLength = {
      type: 'number',
      min: 150,
      max: 200,
    };

    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({name: ruleForName});
      const errors = validator.validate({name: 'Lalala'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({length: ruleForLength});
      const errors = validator.validate({length: 140});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('length');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too little, expect 150, got 140');
    });
    it('валидатор возвращает ошибку, если свойство описанное в правилах отсутствует в объекте',
        () => {
          const validator = new Validator({name: ruleForName});
          const errors = validator.validate({});
          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('name');
          expect(errors[0])
              .to.have.property('error')
              .and.to.be.equal('expect string, got undefined');
        });
    it('возвращает только одну ошибку для одного поля', () => {
      const validator = new Validator({name: ruleForName});
      const errors = validator.validate({name: 7634});
      expect(errors).to.have.length(1);
    });
    it('возвращает только две ошибки для двух полей', () => {
      const validator = new Validator({name: ruleForName, length: ruleForLength});
      const errors = validator.validate({name: 7634, length: '232'});
      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      expect(errors[1]).to.have.property('field').and.to.be.equal('length');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect number, got string');
    });
    it('валидатор возвращает пустой массив, если данные корректны', () => {
      const validator = new Validator({name: ruleForName, length: ruleForLength});
      const errors = validator.validate({name: 'countertop', length: 178});
      expect(errors).to.have.length(0);
    });
    it('валидатор возвращает ошибку, если в правилах не указано свойство min', () => {
      // возможно логичнее сделать проверку самих правил в конструкторе Validator,
      // например, что он бросает ошибку, если правило не корректное
      const validator = new Validator({name: {...ruleForName, min: undefined}});
      const errors = validator.validate({name: 'snake'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('incorrect rule, expect min as number');
    });
    it('валидатор возвращает ошибку, если в правилах не указано свойство max', () => {
      const validator = new Validator({name: {...ruleForName, max: undefined}});
      const errors = validator.validate({name: 'snake'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('incorrect rule, expect max as number');
    });
  });
});
