import $ from 'jquery';

import AutoIncluder from 'components/editor/auto-include';

describe('Auto-includer', function() {
    it('should not be null', function() {
        var instance = new AutoIncluder();
        expect(instance).toBeDefined();
    });
});
