import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Fade,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import {
  History,
  Search,
  Refresh,
  DirectionsCar,
  Schedule,
  AccountBalanceWallet,
  CheckCircle,
  Pending,
} from "@mui/icons-material";

export default function TransactionHistory({ api, onNotify }) {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchPlate, setSearchPlate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data.transactions || []);
      setFilteredTransactions(res.data.transactions || []);
    } catch (err) {
      setError("Failed to load transaction history");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchTransactions, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchPlate.trim()) {
      const filtered = transactions.filter(tx => 
        tx.plateNumber.toLowerCase().includes(searchPlate.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
    setPage(0); // Reset to first page when filtering
  }, [searchPlate, transactions]);

  const handleSearchSpecificPlate = async () => {
    if (!searchPlate.trim()) {
      onNotify?.({
        open: true,
        message: "Please enter a plate number to search",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/history/${searchPlate.trim().toUpperCase()}`);
      setFilteredTransactions(res.data.history || []);
      onNotify?.({
        open: true,
        message: `Found ${res.data.history?.length || 0} transactions for ${searchPlate.toUpperCase()}`,
        severity: "info",
      });
    } catch (err) {
      setError("Failed to load history for specific plate");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getStatusChip = (transaction) => {
    const isCompleted = transaction.exitTime;
    return (
      <Chip
        icon={isCompleted ? <CheckCircle /> : <Pending />}
        label={isCompleted ? "Completed" : "Ongoing"}
        color={isCompleted ? "success" : "warning"}
        size="small"
      />
    );
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalRevenue = transactions
    .filter(tx => tx.cost && tx.exitTime)
    .reduce((sum, tx) => sum + (tx.cost || 0), 0);

  const completedTransactions = transactions.filter(tx => tx.exitTime).length;
  const ongoingTransactions = transactions.filter(tx => !tx.exitTime).length;

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "background.default", 
      display: "flex",
      flexDirection: "column"
    }}>
      <Container maxWidth="xl" sx={{ 
        flex: 1, 
        py: { xs: 3, sm: 4 }, 
        px: { xs: 2, sm: 3 },
        pt: { xs: 10, sm: 11 }, // Account for fixed AppBar
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ width: '100%', maxWidth: '1400px' }}>
            {/* Header */}
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between", 
              alignItems: "center", 
              mb: { xs: 3, sm: 4 },
              gap: 2,
              textAlign: { xs: 'center', sm: 'center' }
            }}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                  Transaction History
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Complete record of all parking transactions and activities
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchTransactions}
                disabled={loading}
                sx={{ minWidth: 120, height: 40 }}
              >
                Refresh
              </Button>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3, mb: 4 }}>
              <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 1 }}>
                    <History />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {transactions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Transactions
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), border: `1px solid ${alpha(theme.palette.success.main, 0.2)}` }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Avatar sx={{ bgcolor: "success.main", mx: "auto", mb: 1 }}>
                    <CheckCircle />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {completedTransactions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}` }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Avatar sx={{ bgcolor: "warning.main", mx: "auto", mb: 1 }}>
                    <Pending />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {ongoingTransactions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ongoing
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Avatar sx={{ bgcolor: "info.main", mx: "auto", mb: 1 }}>
                    <AccountBalanceWallet />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    ₹{totalRevenue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Search */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Search Transactions
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <TextField
                    label="Search by Plate Number"
                    value={searchPlate}
                    onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
                    placeholder="e.g., ABC123"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{ minWidth: 250 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSearchSpecificPlate}
                    disabled={loading}
                  >
                    Search Specific
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchPlate("");
                      fetchTransactions();
                    }}
                  >
                    Show All
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            ) : (
              <Card>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <TableCell fontWeight={600}>Plate Number</TableCell>
                        <TableCell fontWeight={600}>Slot</TableCell>
                        <TableCell fontWeight={600}>Entry Time</TableCell>
                        <TableCell fontWeight={600}>Exit Time</TableCell>
                        <TableCell fontWeight={600}>Duration</TableCell>
                        <TableCell fontWeight={600}>Cost</TableCell>
                        <TableCell fontWeight={600}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                            <DirectionsCar sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                              No transactions found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {searchPlate ? `No transactions found for "${searchPlate}"` : "No parking transactions recorded yet"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedTransactions.map((transaction) => (
                          <TableRow key={transaction.id} hover>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 32, height: 32 }}>
                                  <DirectionsCar fontSize="small" />
                                </Avatar>
                                <Typography fontWeight={600}>
                                  {transaction.plateNumber}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={`Slot ${transaction.slotId}`} variant="outlined" />
                            </TableCell>
                            <TableCell>{formatDateTime(transaction.entryTime)}</TableCell>
                            <TableCell>{formatDateTime(transaction.exitTime)}</TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Schedule sx={{ mr: 1, fontSize: 16, color: "text.secondary" }} />
                                {transaction.duration || "N/A"}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <AccountBalanceWallet sx={{ mr: 1, fontSize: 16, color: "text.secondary" }} />
                                ₹{(transaction.cost || 0).toFixed(2)}
                              </Box>
                            </TableCell>
                            <TableCell>{getStatusChip(transaction)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {filteredTransactions.length > 0 && (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredTransactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </Card>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
