'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { collection, query, getDocs, doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [theme, setTheme] = useState('light'); // Default theme

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Set initial filter
    console.log(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredInventory(inventory);
    } else {
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filtered);
    }
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addItem(item);
      setItem('');
      handleClose();
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeStyles = {
    light: {
      backgroundColor: '#f5f5f5',
      color: '#000',
      borderColor: '#333'
    },
    dark: {
      backgroundColor: '#333',
      color: '#fff',
      borderColor: '#fff'
    }
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      gap={2} 
      sx={{ 
        backgroundColor: themeStyles[theme].backgroundColor, 
        color: themeStyles[theme].color 
      }}
    >
      <Button 
        variant="contained" 
        onClick={toggleTheme} 
        sx={{ position: 'absolute', top: 16, right: 16 }}
        // color={theme === 'light' ? 'default' : 'inherit'}
      >
        Light/Dark Mode
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          flexDirection="column"
          bgcolor="wheat"
          border={`2px solid ${themeStyles[theme].borderColor}`}
          boxShadow={24}
          p={4}
          display="flex"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={item}
              onChange={(e) => setItem(e.target.value)}
              onKeyDown={handleKeyDown} 
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(item);
                setItem('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography
        variant='h1'
        sx={{
          mb: 4,
          textAlign: 'center',
          color: themeStyles[theme].color,
          fontWeight: 'bold',
          fontSize: '2.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        Welcome to Pantry Tracking System
      </Typography>
      <TextField
        variant="outlined"
        label="Search items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, borderColor: themeStyles[theme].borderColor }}
      />
      <Button variant="contained" onClick={handleOpen}>Add new item</Button>
      
      <Box border={`1px solid ${themeStyles[theme].borderColor}`} mt={2} width="800px">
        <Box
          width="100%"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">Inventory Items</Typography>
        </Box>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto" mt={2} border={`1px solid ${themeStyles[theme].borderColor}`}>
        {filteredInventory.map(({ name, quantity }) => (
          <Box key={name} width="100%" minHeight="50px" display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="#f0f0f0" border={`1px solid ${themeStyles[theme].borderColor}`}>
            <Typography variant='h3' color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant='h3' color="#333" textAlign="center">
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" bgcolor="#071591" onClick={() => addItem(name)}>Add</Button>
              <Button variant="contained" color="error" onClick={() => removeItem(name)}>Remove</Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
