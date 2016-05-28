import { viewModel as HomePageViewModel } from 'components/home-page/home';

describe('Home page view model', () => {
    it('should supply a friendly message which changes when acted upon', () => {
        const instance = new HomePageViewModel();
        expect(instance.message()).toContain('Welcome to ');

        // See the message change
        instance.doSomething();
        expect(instance.message()).toContain('You invoked doSomething()');
    });
});
