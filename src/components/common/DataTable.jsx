import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  Checkbox,
} from '@mui/material';

/**
 * Modern data table with sorting, pagination, and selection
 */
export default function DataTable({
  columns = [],
  rows = [],
  page = 0,
  rowsPerPage = 10,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  sortColumn,
  sortDirection = 'asc',
  selectable = false,
  selected = [],
  onSelectAll,
  onSelectRow,
  actions,
  emptyMessage = 'No data available',
  sx = {},
}) {
  const handleSort = (columnId) => {
    if (onSort) {
      const newDirection = sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(columnId, newDirection);
    }
  };

  const handleSelectAll = (event) => {
    if (onSelectAll) {
      onSelectAll(event.target.checked);
    }
  };

  const handleSelectRow = (row) => {
    if (onSelectRow) {
      onSelectRow(row);
    }
  };

  const isSelected = (row) => {
    return selected.some((item) => item.id === row.id);
  };

  return (
    <Box sx={sx}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow
              sx={{
                bgcolor: 'grey.50',
              }}
            >
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    borderBottom: 2,
                    borderColor: 'divider',
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortColumn === column.id}
                      direction={sortColumn === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions && <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                const rowIsSelected = isSelected(row);
                return (
                  <TableRow
                    key={row.id || index}
                    hover
                    selected={rowIsSelected}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      ...(rowIsSelected && {
                        bgcolor: 'action.selected',
                      }),
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={rowIsSelected}
                          onChange={() => handleSelectRow(row)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.render ? column.render(row) : row[column.id]}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          {actions(row)}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {(onPageChange || onRowsPerPageChange) && (
        <TablePagination
          component="div"
          count={totalRows || rows.length}
          page={page}
          onPageChange={(e, newPage) => onPageChange && onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange && onRowsPerPageChange(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        />
      )}
    </Box>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func,
    })
  ).isRequired,
  rows: PropTypes.array.isRequired,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  totalRows: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSort: PropTypes.func,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  selectable: PropTypes.bool,
  selected: PropTypes.array,
  onSelectAll: PropTypes.func,
  onSelectRow: PropTypes.func,
  actions: PropTypes.func,
  emptyMessage: PropTypes.string,
  sx: PropTypes.object,
};
