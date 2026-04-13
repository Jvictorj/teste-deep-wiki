import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;
  let component: HeroComponent;
  let intersectionObserverCallback:
    | IntersectionObserverCallback
    | undefined;

  beforeEach(async () => {
    intersectionObserverCallback = undefined;

    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '';
      readonly thresholds = [0, 0.35, 0.6];

      constructor(callback: IntersectionObserverCallback) {
        intersectionObserverCallback = callback;
      }

      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
      takeRecords = jest.fn(() => []);
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: MockIntersectionObserver,
    });

    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      writable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });

    await TestBed.configureTestingModule({
      imports: [HeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should keep the active conversation tab in view without scrolling the page viewport', () => {
    const tabButtons = fixture.nativeElement.querySelectorAll('.conversation-tab');
    const tabList = fixture.nativeElement.querySelector(
      '.conversation-switcher-tabs'
    ) as HTMLDivElement;
    const tabListScrollTo = jest.fn();
    const scrollIntoViewSpy = jest.spyOn(
      HTMLElement.prototype,
      'scrollIntoView'
    );

    Object.defineProperty(tabList, 'scrollLeft', {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(tabList, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(tabList, 'clientWidth', {
      configurable: true,
      value: 120,
    });
    Object.defineProperty(tabList, 'clientHeight', {
      configurable: true,
      value: 56,
    });
    tabList.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 120,
      bottom: 56,
      width: 120,
      height: 56,
    })) as any;
    tabButtons[0].getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 96,
      bottom: 48,
      width: 96,
      height: 48,
    })) as any;

    tabList.scrollTo = tabListScrollTo;
    scrollIntoViewSpy.mockClear();

    component.selectConversation(0);
    fixture.detectChanges();

    expect(component.activeConversationIndex).toBe(0);
    expect(tabListScrollTo).not.toHaveBeenCalled();
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it('should scroll the tab list vertically to reveal the active conversation on desktop layout', () => {
    const tabButtons = fixture.nativeElement.querySelectorAll('.conversation-tab');
    const tabList = fixture.nativeElement.querySelector(
      '.conversation-switcher-tabs'
    ) as HTMLDivElement;
    const tabListScrollTo = jest.fn();

    Object.defineProperty(tabList, 'scrollLeft', {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(tabList, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(tabList, 'clientWidth', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(tabList, 'clientHeight', {
      configurable: true,
      value: 120,
    });
    Object.defineProperty(tabList, 'scrollWidth', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(tabList, 'scrollHeight', {
      configurable: true,
      value: 400,
    });
    tabList.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 200,
      bottom: 120,
      width: 200,
      height: 120,
    })) as any;
    tabButtons[4].getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 240,
      right: 180,
      bottom: 288,
      width: 180,
      height: 48,
    })) as any;

    tabList.scrollTo = tabListScrollTo;

    component.selectConversation(4);
    fixture.detectChanges();

    expect(component.activeConversationIndex).toBe(4);
    expect(tabListScrollTo).toHaveBeenCalledWith({
      left: 0,
      top: 168,
      behavior: 'smooth',
    });
  });

  it('should scroll the tab list when the active conversation changes programmatically', () => {
    const heroWithInternals = component as unknown as {
      setActiveConversation(conversationIndex: number): void;
    };
    const tabButtons = fixture.nativeElement.querySelectorAll('.conversation-tab');
    const tabList = fixture.nativeElement.querySelector(
      '.conversation-switcher-tabs'
    ) as HTMLDivElement;
    const tabListScrollTo = jest.fn();

    Object.defineProperty(tabList, 'scrollLeft', {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(tabList, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(tabList, 'clientWidth', {
      configurable: true,
      value: 120,
    });
    Object.defineProperty(tabList, 'clientHeight', {
      configurable: true,
      value: 56,
    });
    Object.defineProperty(tabList, 'scrollWidth', {
      configurable: true,
      value: 576,
    });
    Object.defineProperty(tabList, 'scrollHeight', {
      configurable: true,
      value: 56,
    });
    tabList.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 120,
      bottom: 56,
      width: 120,
      height: 56,
    })) as any;
    tabButtons[4].getBoundingClientRect = jest.fn(() => ({
      left: 480,
      top: 0,
      right: 576,
      bottom: 48,
      width: 96,
      height: 48,
    })) as any;

    tabList.scrollTo = tabListScrollTo;

    heroWithInternals.setActiveConversation(4);
    fixture.detectChanges();

    expect(component.activeConversationIndex).toBe(4);
    expect(tabListScrollTo).toHaveBeenCalledWith({
      left: 456,
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should pause the demo out of view and restart when the hero chat becomes visible again', () => {
    const heroWithInternals = component as unknown as {
      startConversationPlayback(): void;
      clearTimers(): void;
    };
    const startPlaybackSpy = jest.spyOn(
      heroWithInternals,
      'startConversationPlayback'
    );
    const clearTimersSpy = jest.spyOn(heroWithInternals, 'clearTimers');

    startPlaybackSpy.mockClear();
    clearTimersSpy.mockClear();
    component.isTypingVisible = true;

    intersectionObserverCallback?.([
      {
        isIntersecting: false,
        intersectionRatio: 0.1,
      } as IntersectionObserverEntry,
    ], {} as IntersectionObserver);

    expect(component.isTypingVisible).toBe(false);
    expect(clearTimersSpy).toHaveBeenCalledTimes(1);

    intersectionObserverCallback?.([
      {
        isIntersecting: true,
        intersectionRatio: 0.6,
      } as IntersectionObserverEntry,
    ], {} as IntersectionObserver);

    expect(startPlaybackSpy).toHaveBeenCalledTimes(1);
  });

  it('should ignore chat scroll events triggered by programmatic autoplay scrolling', () => {
    const heroWithInternals = component as unknown as {
      shouldAutoScrollChat: boolean;
      programmaticScrollLock: boolean;
    };
    const chatContainer = document.createElement('div') as HTMLDivElement;

    Object.defineProperty(chatContainer, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(chatContainer, 'clientHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(chatContainer, 'scrollHeight', {
      configurable: true,
      value: 500,
    });

    component.chatContainer = {
      nativeElement: chatContainer,
    } as ElementRef<HTMLDivElement>;

    heroWithInternals.shouldAutoScrollChat = true;
    heroWithInternals.programmaticScrollLock = true;

    component.handleChatScroll();

    expect(heroWithInternals.shouldAutoScrollChat).toBe(true);
  });
});
