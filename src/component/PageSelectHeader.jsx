import React, { useCallback, useEffect, useRef, useState } from "react";

// Rows of the page on screen; rows still loading (no data) are skipped
const getPageNodes = (api) => {
  const pageSize = api.paginationGetPageSize();
  const start = api.paginationGetCurrentPage() * pageSize;
  const end = Math.min(start + pageSize, api.getDisplayedRowCount());
  const nodes = [];
  for (let i = start; i < end; i++) {
    const node = api.getDisplayedRowAtIndex(i);
    if (node?.data) nodes.push(node);
  }
  return nodes;
};

/**
 * Header checkbox for the selection column of a PaginatedGrid.
 * AG Grid's own header checkbox doesn't work with the infinite row model, so
 * this one selects / deselects the rows of the current page itself.
 *
 * Unchecked: nothing on the page selected, click selects the page
 * Partial:   some rows selected, click selects the rest of the page
 * Checked:   whole page selected, click clears the page
 *
 * Usage: rowSelection={{ mode: "multiRow", headerCheckbox: false }}
 *        selectionColumnDef={{ headerComponent: PageSelectHeader }}
 */
const PageSelectHeader = ({ api }) => {
  const inputRef = useRef();
  const [state, setState] = useState("none"); // "none" | "some" | "all"

  const update = useCallback(() => {
    const nodes = getPageNodes(api);
    const selected = nodes.filter((node) => node.isSelected()).length;
    setState(
      !selected ? "none" : selected === nodes.length ? "all" : "some",
    );
  }, [api]);

  useEffect(() => {
    const events = ["selectionChanged", "paginationChanged", "modelUpdated"];
    events.forEach((e) => api.addEventListener(e, update));
    update();
    return () => {
      if (api.isDestroyed()) return;
      events.forEach((e) => api.removeEventListener(e, update));
    };
  }, [api, update]);

  // `indeterminate` is a DOM property only, there is no attribute for it
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = state === "some";
  }, [state]);

  const handleChange = () => {
    api.setNodesSelected({ nodes: getPageNodes(api), newValue: state !== "all" });
  };

  return (
    <input
      ref={inputRef}
      type="checkbox"
      checked={state === "all"}
      onChange={handleChange}
      title={state === "all" ? "Clear this page" : "Select this page"}
      style={{ width: 15, height: 15, cursor: "pointer" }}
    />
  );
};

export default PageSelectHeader;
