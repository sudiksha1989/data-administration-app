const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const lockExceptions = require('../pages/lockExceptions.page');

defineSupportCode(({ Given, When, Then }) => {
    let countBeforeAction;
    // *********************************************************
    // Background:
    // *********************************************************
    // Shared:
    // that I am logged in to the Sierra Leone DHIS2
    When(/^I open lock exceptions page$/, () => {
        lockExceptions.open();
    });

    // *********************************************************
    // Commons:
    // *********************************************************

    // Remove
    Then(/^I click one of the remove lock exception icons$/, () => {
        countBeforeAction = lockExceptions.getTotalExceptions();
        lockExceptions.removeIcon().click();
    });

    // Remove Batch (Area)
    Then(/^I click batch deletion button$/, () => {
        lockExceptions.getBatchDeletionBtn().click();
    });

    // Add lock exception
    Then(/^I click in add lock exception button in list screen$/, () => {
        countBeforeAction = lockExceptions.getTotalExceptions();
        lockExceptions.addLockExceptionButton().click();
    });

    Then(/^Add lock exception form is displayed$/, () => {
        browser.waitForVisible('#addLockExceptionFormId', 5000);
    });

    Then(/^A select a data set for new lock exception is displayed$/, () => {
        browser.waitForVisible('.d2-ui-selectfield', 5000);
    });

    Then(/^I select a data set for new lock exception$/, () => {
        expect(lockExceptions.selectADataSet()).to.equal(lockExceptions.getSelectedDataSet());
    });

    // *********************************************************
    // Scenario: I want to see all Lock Exceptions in the page
    // *********************************************************
    Then(/^A list of exceptions is displayed$/, () => {
        browser.waitForVisible('.data-table', 5000);
    });

    Then(/^Pagination and number of rows are displayed$/, () => {
        browser.waitForVisible('.data-table-pager', 5000);
    });

    Then(/^I can see a button to add lock a exception$/, () => {
        browser.waitForVisible('#addExceptionButtonId', 5000);
    });

    Then(/^For each lock exception there is a remove icon$/, () => {
        expect(lockExceptions.getTableRows()).to.equal(lockExceptions.getTableRemoveIcons());
    });

    // *********************************************************
    // Scenario: I want to remove the lock exception
    // *********************************************************
    // Commons:
    // I click one of the remove lock exception icons
    Then(/^I confirm lock exception removal$/, () => {
        lockExceptions.confirmRemoveSnackbar().click();
        browser.waitForVisible('span[id=feedbackSnackbarId]');
    });

    Then(/^The exception is removed$/, () => {
        expect(lockExceptions.getTotalExceptions()).to.equal(countBeforeAction - 1);
    });

    // *********************************************************
    // Scenario: I do not want to remove lock exception
    // *********************************************************
    // Commons:
    // I click remove lock exception icon
    Then(/^I do not confirm lock exception removal$/, () => {
        lockExceptions.notConfirmRemoveLockException();
    });

    Then(/^The exception is not removed$/, () => {
        expect(lockExceptions.getTotalExceptions()).to.equal(countBeforeAction);
    });

    // *********************************************************
    // Scenario: I want to see the screen to add lock exception
    // *********************************************************
    // Commons:
    // I click in add lock exception button in list screen
    // Add lock exception form is displayed
    // A select a data set for new lock exception is displayed
    // I select a data set for new lock exception
    Then(/^Organization unit tree is displayed$/, () => {
        browser.waitForVisible('.tree-view', 8000);
    });

    Then(/^Period select is displayed$/, () => {
        browser.waitForVisible('#idPeriodPicker', 2000);
    });

    Then(/^Organization unit level select is displayed$/, () => {
        browser.waitForVisible('div[id*="Selectitem-OrganisationUnitLevel"]', 2000);
    });

    Then(/^Organization unit group select is displayed$/, () => {
        browser.waitForVisible('div[id*="Selectitem-OrganisationUnitGroup"]', 2000);
    });

    // *********************************************************
    // Scenario: I want to add lock exceptions
    // *********************************************************
    // Commons:
    // I click in add lock exception button in list screen
    // Add lock exception form is displayed
    // A select a data set for new lock exception is displayed
    // I select a data set for new lock exception
    Then(/^I select an organization unit from the organization unit tree$/, () => {
        lockExceptions.getOneOrgUnitTreeFromTree().click();
    });

    Then(/^I select period for new lock exception$/, () => {
        lockExceptions.selectAnYear();
        browser.pause(2000);
        lockExceptions.selectAMonth();
        browser.pause(2000);
    });

    Then(/^Click add button in add new lock exception form$/, () => {
        countBeforeAction = lockExceptions.getTotalExceptions();
        lockExceptions.getFormAddLockExceptionBtn().click();
        browser.waitForVisible('span[id=feedbackSnackbarId]');
    });

    Then(/^The lock exception is added to the list of lock exceptions$/, () => {
        browser.pause(2000);
        expect(lockExceptions.getTotalExceptions()).to.equal(countBeforeAction + 1);
    });

    // *********************************************************
    // Scenario: I want to see Batch Deletion section
    // *********************************************************
    // Commons: I click batch deletion button
    Then(/^Title batch deletion is displayed$/, () => {
        expect(lockExceptions.getSubTitle()).to.equal('Batch Deletion');
    });

    Then(/^A list of lock exceptions batches is displayed$/, () => {
        browser.waitForVisible('.data-table', 5000);
    });

    Then(/^For each displayed lock exception batch there is a remove icon$/, () => {
        expect(lockExceptions.getTableRows()).to.equal(lockExceptions.getTableRemoveIcons());
    });

    Then(/^I can return to previous page$/, () => {
        browser.waitForVisible('.material-icons=arrow_back', 5000);
    });

    // *********************************************************
    // Scenario: I want to execute batch deletion
    // *********************************************************
    // Commons: I click batch deletion button
    Then(/^I click remove lock exception batch icon$/, () => {
        countBeforeAction = lockExceptions.getTableRows();
        lockExceptions.removeIcon().click();
    });

    Then(/^I confirm lock exception batch removal$/, () => {
        lockExceptions.confirmRemoveSnackbar().click();
    });

    Then(/^The exception batch is removed$/, () => {
        browser.pause(2000);
        expect(lockExceptions.getTableRows()).to.equal(countBeforeAction - 1);
    });
});
