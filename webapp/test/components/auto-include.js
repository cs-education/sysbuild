import $ from 'jquery';

import AutoIncluder from 'components/editor/auto-include';

describe('Auto-includer', () => {
    it('should not be null', () => {
        const instance = new AutoIncluder();
        expect(instance).toBeDefined();
    });
});
