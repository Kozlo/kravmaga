const { expect } = require('chai');
const { isFieldPositiveInteger } = require('../../helpers/modelValidators');

describe('modelValidators', () => {
    describe('isFieldPositiveInteger', () => {
        it('should return true if a positive integer or 0 is passed', () => {
            expect(isFieldPositiveInteger(3)).to.be.true;
            expect(isFieldPositiveInteger(1231233)).to.be.true;
            expect(isFieldPositiveInteger(0)).to.be.true;
            expect(isFieldPositiveInteger(-1)).to.be.false;
            expect(isFieldPositiveInteger(-132)).to.be.false;
            expect(isFieldPositiveInteger('aaa')).to.be.false;
            expect(isFieldPositiveInteger(true)).to.be.false;
            expect(isFieldPositiveInteger(false)).to.be.false;
            expect(isFieldPositiveInteger('11')).to.be.false;
        });
    });
});
