import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#08306b',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorCard: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#1649b2',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1649b2',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#1649b2',
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
  },
  card: {
    margin: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1649b2',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 10,
    height: 1,
  },
  fieldRow: {
    marginVertical: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  input: {
    fontSize: 14,
    backgroundColor: '#fff',
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  uploadButton: {
    marginLeft: 10,
  },
  uploadSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fileText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  uploadActionButton: {
    backgroundColor: '#1649b2',
  },
  noteText: {
    fontSize: 12,
    color: '#ed6c02',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  documentTable: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f4ff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#08306b',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 10,
  },
  prevButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#1649b2',
  },
  dropdownButton: {
    position: 'relative',
  },
  dropdownButtonDisabled: {
    opacity: 0.6,
  },
  menuContent: {
    backgroundColor: '#fff',
    maxHeight: 300,
  },
  menuItemText: {
    fontSize: 14,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownModal: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: 300,
    zIndex: 1000,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: '#333',
  },
});

