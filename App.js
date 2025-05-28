import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
} from 'react-native-chart-kit';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;
const chartWidth = Math.max(screenWidth * 1.5, 800); // Make charts wider than screen

// Mock data (same as JSON file)
const mockData = {
  "statistics": {
    "dailySessions": [
      { "date": "2024-01-01", "sessions": 85, "activeUsers": 60, "avgDuration": 35 },
      { "date": "2024-01-02", "sessions": 92, "activeUsers": 65, "avgDuration": 38 },
      { "date": "2024-01-03", "sessions": 88, "activeUsers": 62, "avgDuration": 36 },
      { "date": "2024-01-04", "sessions": 95, "activeUsers": 68, "avgDuration": 39 },
      { "date": "2024-01-05", "sessions": 102, "activeUsers": 72, "avgDuration": 41 },
      { "date": "2024-01-06", "sessions": 98, "activeUsers": 70, "avgDuration": 40 },
      { "date": "2024-01-07", "sessions": 105, "activeUsers": 75, "avgDuration": 42 },
      { "date": "2024-01-08", "sessions": 112, "activeUsers": 80, "avgDuration": 43 },
      { "date": "2024-01-09", "sessions": 108, "activeUsers": 78, "avgDuration": 42 },
      { "date": "2024-01-10", "sessions": 115, "activeUsers": 82, "avgDuration": 44 },
      { "date": "2024-01-11", "sessions": 122, "activeUsers": 85, "avgDuration": 45 },
      { "date": "2024-01-12", "sessions": 118, "activeUsers": 83, "avgDuration": 44 },
      { "date": "2024-01-13", "sessions": 125, "activeUsers": 88, "avgDuration": 46 },
      { "date": "2024-01-14", "sessions": 132, "activeUsers": 92, "avgDuration": 47 },
      { "date": "2024-01-15", "sessions": 128, "activeUsers": 90, "avgDuration": 46 },
      { "date": "2024-01-16", "sessions": 135, "activeUsers": 95, "avgDuration": 48 },
      { "date": "2024-01-17", "sessions": 142, "activeUsers": 98, "avgDuration": 49 },
      { "date": "2024-01-18", "sessions": 138, "activeUsers": 96, "avgDuration": 48 },
      { "date": "2024-01-19", "sessions": 145, "activeUsers": 100, "avgDuration": 50 },
      { "date": "2024-01-20", "sessions": 152, "activeUsers": 105, "avgDuration": 51 },
      { "date": "2024-01-21", "sessions": 148, "activeUsers": 103, "avgDuration": 50 },
      { "date": "2024-01-22", "sessions": 155, "activeUsers": 108, "avgDuration": 52 },
      { "date": "2024-01-23", "sessions": 162, "activeUsers": 112, "avgDuration": 53 },
      { "date": "2024-01-24", "sessions": 158, "activeUsers": 110, "avgDuration": 52 },
      { "date": "2024-01-25", "sessions": 165, "activeUsers": 115, "avgDuration": 54 },
      { "date": "2024-01-26", "sessions": 172, "activeUsers": 118, "avgDuration": 55 },
      { "date": "2024-01-27", "sessions": 168, "activeUsers": 116, "avgDuration": 54 },
      { "date": "2024-01-28", "sessions": 175, "activeUsers": 120, "avgDuration": 56 },
      { "date": "2024-01-29", "sessions": 182, "activeUsers": 125, "avgDuration": 57 },
      { "date": "2024-01-30", "sessions": 178, "activeUsers": 123, "avgDuration": 56 },
      { "date": "2024-01-31", "sessions": 185, "activeUsers": 128, "avgDuration": 58 }
    ],
    "monthlyStats": [
      {
        "month": "January 2024",
        "totalSessions": 3850,
        "totalUsers": 2680,
        "avgSessionDuration": 46.5,
        "peakConcurrentUsers": 128
      },
      {
        "month": "February 2024",
        "totalSessions": 4200,
        "totalUsers": 2950,
        "avgSessionDuration": 48.2,
        "peakConcurrentUsers": 142
      },
      {
        "month": "March 2024",
        "totalSessions": 4550,
        "totalUsers": 3220,
        "avgSessionDuration": 49.8,
        "peakConcurrentUsers": 156
      },
      {
        "month": "April 2024",
        "totalSessions": 4900,
        "totalUsers": 3490,
        "avgSessionDuration": 51.5,
        "peakConcurrentUsers": 170
      },
      {
        "month": "May 2024",
        "totalSessions": 5250,
        "totalUsers": 3760,
        "avgSessionDuration": 53.2,
        "peakConcurrentUsers": 184
      },
      {
        "month": "June 2024",
        "totalSessions": 5600,
        "totalUsers": 4030,
        "avgSessionDuration": 54.9,
        "peakConcurrentUsers": 198
      }
    ],
    "summary": {
      "totalSessions": 28350,
      "totalUsers": 20130,
      "avgSessionDuration": 50.7,
      "peakConcurrentUsers": 198,
      "growthRate": 12.5,
      "retentionRate": 82.3
    }
  }
};

const hourlyUsageData = [
  { hour: 0, sessions: 2 }, { hour: 1, sessions: 1 }, { hour: 2, sessions: 1 },
  { hour: 3, sessions: 0 }, { hour: 4, sessions: 1 }, { hour: 5, sessions: 3 },
  { hour: 6, sessions: 8 }, { hour: 7, sessions: 15 }, { hour: 8, sessions: 22 },
  { hour: 9, sessions: 18 }, { hour: 10, sessions: 12 }, { hour: 11, sessions: 14 },
  { hour: 12, sessions: 16 }, { hour: 13, sessions: 13 }, { hour: 14, sessions: 11 },
  { hour: 15, sessions: 9 }, { hour: 16, sessions: 12 }, { hour: 17, sessions: 19 },
  { hour: 18, sessions: 25 }, { hour: 19, sessions: 21 }, { hour: 20, sessions: 16 },
  { hour: 21, sessions: 12 }, { hour: 22, sessions: 8 }, { hour: 23, sessions: 5 },
];

const chargerTypeData = [
  { name: "Level 1", population: 45, color: "#10b981", legendFontColor: "#7F7F7F" },
  { name: "Level 2", population: 156, color: "#3b82f6", legendFontColor: "#7F7F7F" },
  { name: "DC Fast", population: 89, color: "#8b5cf6", legendFontColor: "#7F7F7F" },
];

const locationData = [
  { location: "Home Chargers", sessions: 120, energy: 1456.8, revenue: 72840 },
  { location: "Office Complex", sessions: 95, energy: 1234.5, revenue: 61725 },
  { location: "Shopping Mall", sessions: 75, energy: 987.3, revenue: 49365 },
];

// Custom Dropdown Component
const CustomDropdown = ({ value, options, onSelect, style }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>{value}</Text>
        <Icon name="keyboard-arrow-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.dropdownModal}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => {
                  onSelect(option.value);
                  setIsVisible(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Scrollable Chart Component
const ScrollableChart = ({ title, subtitle, children }) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <Text style={styles.chartSubtitle}>{subtitle}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={{ paddingRight: 20 }}>
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, change, icon, timePeriod, onTimePeriodChange, color }) => {
  const timeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={styles.metricTitleRow}>
          <Icon name={icon} size={20} color="#666" />
          <Text style={styles.metricTitle}>{title}</Text>
        </View>
        <CustomDropdown
          value={timeOptions.find(opt => opt.value === timePeriod)?.label}
          options={timeOptions}
          onSelect={onTimePeriodChange}
          style={styles.metricDropdown}
        />
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricChange}>{change}</Text>
    </View>
  );
};

// Dashboard Screen
const DashboardScreen = () => {
  const [sessionsView, setSessionsView] = useState('month');
  const [usersView, setUsersView] = useState('month');
  const [durationView, setDurationView] = useState('month');
  const [revenueView, setRevenueView] = useState('month');

  const getSessionsData = (period) => {
    switch (period) {
      case 'today':
        const todaySessions = mockData.statistics.dailySessions[mockData.statistics.dailySessions.length - 1]?.sessions || 0;
        return { value: todaySessions.toLocaleString('en-IN'), change: '+8% from yesterday' };
      case 'week':
        const weekSessions = mockData.statistics.dailySessions.slice(-7).reduce((sum, day) => sum + day.sessions, 0);
        return { value: weekSessions.toLocaleString('en-IN'), change: '+12% from last week' };
      case 'month':
        return { value: mockData.statistics.summary.totalSessions.toLocaleString('en-IN'), change: `+${mockData.statistics.summary.growthRate}% from last month` };
    }
  };

  const getUsersData = (period) => {
    switch (period) {
      case 'today':
        const todayUsers = mockData.statistics.dailySessions[mockData.statistics.dailySessions.length - 1]?.activeUsers || 0;
        return { value: todayUsers.toLocaleString('en-IN'), change: '+5% from yesterday' };
      case 'week':
        const weekUsers = mockData.statistics.dailySessions.slice(-7).reduce((sum, day) => sum + day.activeUsers, 0);
        return { value: weekUsers.toLocaleString('en-IN'), change: '+8% from last week' };
      case 'month':
        return { value: mockData.statistics.summary.totalUsers.toLocaleString('en-IN'), change: `Retention: ${mockData.statistics.summary.retentionRate}%` };
    }
  };

  const getDurationData = (period) => {
    switch (period) {
      case 'today':
        const todayDuration = mockData.statistics.dailySessions[mockData.statistics.dailySessions.length - 1]?.avgDuration || 0;
        return { value: `${todayDuration} min`, change: '+3% from yesterday' };
      case 'week':
        const weekDuration = mockData.statistics.dailySessions.slice(-7).reduce((sum, day) => sum + day.avgDuration, 0) / 7;
        return { value: `${weekDuration.toFixed(1)} min`, change: '+5% from last week' };
      case 'month':
        return { value: `${mockData.statistics.summary.avgSessionDuration} min`, change: '+7% from last month' };
    }
  };

  const getRevenueData = (period) => {
    const revenuePerSession = 50; // ₹50 per session
    
    switch (period) {
      case 'today':
        const todaySessions = mockData.statistics.dailySessions[mockData.statistics.dailySessions.length - 1]?.sessions || 0;
        const todayRevenue = todaySessions * revenuePerSession;
        return { value: `₹${todayRevenue.toLocaleString('en-IN')}`, change: '+7% from yesterday' };
      case 'week':
        const weekSessions = mockData.statistics.dailySessions.slice(-7).reduce((sum, day) => sum + day.sessions, 0);
        const weekRevenue = weekSessions * revenuePerSession;
        return { value: `₹${weekRevenue.toLocaleString('en-IN')}`, change: '+12% from last week' };
      case 'month':
        const monthRevenue = mockData.statistics.summary.totalSessions * revenuePerSession;
        return { value: `₹${monthRevenue.toLocaleString('en-IN')}`, change: '+18% from last month' };
    }
  };

  const sessionsData = getSessionsData(sessionsView);
  const usersData = getUsersData(usersView);
  const durationData = getDurationData(durationView);
  const revenueData = getRevenueData(revenueView);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="flash-on" size={32} color="#10b981" />
          <Text style={styles.headerTitle}>EV Charger Dashboard</Text>
          <Text style={styles.headerSubtitle}>Real-time charging statistics</Text>
        </View>

        {/* Metric Cards */}
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Total Sessions"
            value={sessionsData.value}
            change={sessionsData.change}
            icon="people"
            timePeriod={sessionsView}
            onTimePeriodChange={setSessionsView}
            color="#10b981"
          />
          <MetricCard
            title="Active Users"
            value={usersData.value}
            change={usersData.change}
            icon="person"
            timePeriod={usersView}
            onTimePeriodChange={setUsersView}
            color="#3b82f6"
          />
          <MetricCard
            title="Avg Duration"
            value={durationData.value}
            change={durationData.change}
            icon="schedule"
            timePeriod={durationView}
            onTimePeriodChange={setDurationView}
            color="#8b5cf6"
          />
          <MetricCard
            title="Revenue Generated"
            value={revenueData.value}
            change={revenueData.change}
            icon="trending-up"
            timePeriod={revenueView}
            onTimePeriodChange={setRevenueView}
            color="#f59e0b"
          />
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Key Performance Indicators</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Growth Rate</Text>
              <Text style={styles.summaryValue}>{mockData.statistics.summary.growthRate}%</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Retention Rate</Text>
              <Text style={styles.summaryValue}>{mockData.statistics.summary.retentionRate}%</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Peak Users</Text>
              <Text style={styles.summaryValue}>{mockData.statistics.summary.peakConcurrentUsers}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Daily Usage Screen
const DailyUsageScreen = () => {
  // Use last 14 days for more detailed view
  const last14Days = mockData.statistics.dailySessions.slice(-14);
  
  const chartData = {
    labels: last14Days.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: last14Days.map(item => item.sessions),
    }],
  };

  const usersChartData = {
    labels: last14Days.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: last14Days.map(item => item.activeUsers),
    }],
  };

  const durationChartData = {
    labels: last14Days.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: last14Days.map(item => item.avgDuration),
    }],
  };

  const revenueChartData = {
    labels: last14Days.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: last14Days.map(item => item.sessions * 50), // ₹50 per session
    }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ScrollableChart 
          title="Daily Charging Sessions" 
          subtitle="Last 14 days"
        >
          <BarChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              style: { borderRadius: 16 },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            style={styles.chart}
            fromZero
          />
        </ScrollableChart>

        <ScrollableChart 
          title="Active Users Trend" 
          subtitle="Daily active users"
        >
          <LineChart
            data={usersChartData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              style: { borderRadius: 16 },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            style={styles.chart}
            bezier
          />
        </ScrollableChart>

        <ScrollableChart 
          title="Session Duration" 
          subtitle="Average duration in minutes"
        >
          <LineChart
            data={durationChartData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
              style: { borderRadius: 16 },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            style={styles.chart}
            bezier
          />
        </ScrollableChart>

        <ScrollableChart 
          title="Revenue Tracking" 
          subtitle="Daily revenue in INR"
        >
          <LineChart
            data={revenueChartData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
              style: { borderRadius: 16 },
              formatYLabel: (value) => `₹${(value / 1000).toFixed(0)}K`,
              propsForLabels: {
                fontSize: 10,
              },
            }}
            style={styles.chart}
            bezier
          />
        </ScrollableChart>
      </ScrollView>
    </SafeAreaView>
  );
};

// Hourly Pattern Screen
const HourlyPatternScreen = () => {
  const chartData = {
    labels: hourlyUsageData.map(item => item.hour.toString()),
    datasets: [{
      data: hourlyUsageData.map(item => item.sessions),
    }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ScrollableChart 
          title="Hourly Usage Pattern" 
          subtitle="Average sessions by hour"
        >
          <BarChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            style={styles.chart}
            fromZero
          />
        </ScrollableChart>

        {/* Peak Hours Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Peak Usage Hours</Text>
          <View style={styles.infoItem}>
            <Icon name="schedule" size={20} color="#10b981" />
            <Text style={styles.infoText}>Morning Peak: 7:00 - 9:00 AM</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="schedule" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>Evening Peak: 6:00 - 8:00 PM</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="schedule" size={20} color="#8b5cf6" />
            <Text style={styles.infoText}>Low Usage: 11:00 PM - 5:00 AM</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Charger Types Screen
const ChargerTypesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Charger Type Distribution</Text>
          <Text style={styles.chartSubtitle}>Usage breakdown by type</Text>
          <PieChart
            data={chargerTypeData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>

        {/* Charger Details */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Charger Details</Text>
          {chargerTypeData.map((item, index) => (
            <View key={index} style={styles.chargerTypeItem}>
              <View style={styles.chargerTypeInfo}>
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                <Text style={styles.chargerTypeName}>{item.name}</Text>
              </View>
              <Text style={styles.chargerTypeCount}>{item.population} sessions</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Locations Screen
const LocationsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Usage by Location</Text>
          {locationData.map((location, index) => (
            <View key={index} style={styles.locationItem}>
              <View style={styles.locationInfo}>
                <Icon name="location-on" size={24} color="#666" />
                <View style={styles.locationDetails}>
                  <Text style={styles.locationName}>{location.location}</Text>
                  <Text style={styles.locationEnergy}>{location.energy} kWh delivered</Text>
                  <Text style={styles.locationRevenue}>₹{location.revenue.toLocaleString('en-IN')} revenue</Text>
                </View>
              </View>
              <View style={styles.locationBadge}>
                <Text style={styles.locationSessions}>{location.sessions}</Text>
                <Text style={styles.locationSessionsLabel}>sessions</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Drawer Navigator
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#f8f9fa',
            width: 280,
          },
          drawerActiveTintColor: '#10b981',
          drawerInactiveTintColor: '#666',
          headerStyle: {
            backgroundColor: '#10b981',
          },
          headerTintColor: '#fff',
        }}
      >
        <Drawer.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="dashboard" size={24} color={color} />,
          }}
        />
        <Drawer.Screen 
          name="Daily Usage" 
          component={DailyUsageScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="bar-chart" size={24} color={color} />,
          }}
        />
        <Drawer.Screen 
          name="Hourly Pattern" 
          component={HourlyPatternScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="schedule" size={24} color={color} />,
          }}
        />
        <Drawer.Screen 
          name="Charger Types" 
          component={ChargerTypesScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="pie-chart" size={24} color={color} />,
          }}
        />
        <Drawer.Screen 
          name="Locations" 
          component={LocationsScreen}
          options={{
            drawerIcon: ({ color }) => <Icon name="location-on" size={24} color={color} />,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  metricsContainer: {
    gap: 15,
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  metricTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  metricDropdown: {
    minWidth: 100,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metricChange: {
    fontSize: 12,
    color: '#6b7280',
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 100,
  },
  dropdownButtonText: {
    fontSize: 12,
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
  },
  chargerTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  chargerTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  chargerTypeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  chargerTypeCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  locationEnergy: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  locationRevenue: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
    fontWeight: '500',
  },
  locationBadge: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  locationSessions: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  locationSessionsLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
});

export default App;