/* Lists Sorting */

tpt.listSearchAndSort = function (sortField, entityType) {
    "use strict";
    if (sortField && entityType && (entityType === "job" || entityType === "person")) {
        document.getElementById("tpt_" + entityType + "Sort").value = sortField;

        var sortDirection;

        if (sortField === tpt.backend.pageParameters[entityType + "Sort"]) {
            if (tpt.backend.pageParameters[entityType + "SortDirection"] === "ASC") {
                sortDirection = "DESC";
            } else {
                sortDirection = "ASC";
            }
        } else {
            sortDirection = "ASC";
        }

        document.getElementById("tpt_" + entityType + "SortDirection").value = sortDirection;
        document.getElementById("tpt_" + entityType + "SortableForm").submit();
    }
};

tpt.listSearchAndSortPeopleByJobId = function (jobId) {
    "use strict";
    document.getElementById("tpt_personSort_" + tpt.backend.jobLabel + "Id").value = jobId || "";
    document.getElementById("tpt_personSortableForm").submit();
};
