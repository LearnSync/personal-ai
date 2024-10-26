import TabSessionManager from "../tabSessionManager";

describe("TabSessionManager", () => {
  let tabSessionManager: TabSessionManager;

  beforeEach(() => {
    tabSessionManager = TabSessionManager.getInstance();
  });

  it("should create a new tab", () => {
    const tab = tabSessionManager.createTab("Test Tab");
    expect(tab).toHaveProperty("id");
    expect(tab.label).toBe("Test Tab");
  });

  it("should set active tab by ID", () => {
    const tab = tabSessionManager.createTab("Active Tab");
    tabSessionManager.setActiveTab(tab.id);
    expect(tabSessionManager.getActiveTabId()).toBe(tab.id);
  });

  it("should update tab label", () => {
    const tab = tabSessionManager.createTab("Old Label");
    tabSessionManager.updateTabLabel(tab.id, "New Label");
    const updatedTab = tabSessionManager.getTabs().find((t) => t.id === tab.id);
    expect(updatedTab?.label).toBe("New Label");
  });

  it("should lock and unlock a tab", () => {
    const tab = tabSessionManager.createTab("Lockable Tab");
    tabSessionManager.lockTab(tab.id);
    expect(tab?.isLocked).toBe(true);

    tabSessionManager.unlockTab(tab.id);
    expect(tab?.isLocked).toBe(false);
  });

  it("should close all tabs", () => {
    tabSessionManager.createTab("Tab 1");
    tabSessionManager.createTab("Tab 2");
    tabSessionManager.closeAllTabs();
    expect(tabSessionManager.getTabs()).toHaveLength(0);
    expect(tabSessionManager.getActiveTabId()).toBeNull();
  });
});
