chrome.action.onClicked.addListener(tab => collapseTabs(false));
chrome.commands.onCommand.addListener(command => {
  if (command == 'group-all') {
    collapseTabs();
  }

  if (command == 'group-others') {
    collapseTabs(false);
  }
});

function collapseTabs(includeCurrent = true) {
  let queryOptions = {
    currentWindow: true,
    pinned: false
  }

  if (!includeCurrent) {
    queryOptions = {
      ...queryOptions,
      active: false
    }
  }

  chrome.tabs.query(queryOptions)
    .then(tabs => {
      const tabIds = tabs
            .filter(t => t.groupId < 0)
            .map(t => t.id);

      if (tabIds.length) {
        const groupProperties = {
          collapsed: true,
          title: '🧹'
        }

        chrome.tabs.group({ tabIds })
          .then(id => chrome.tabGroups.update(id, groupProperties));
      }
    });
}
