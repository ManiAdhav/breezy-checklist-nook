
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Generic function to fetch data from Supabase or fall back to localStorage
 * @param tableName The name of the table to fetch from
 * @param storageKey The localStorage key for fallback
 * @returns Promise resolving to the data
 */
export const fetchData = async <T>(tableName: string, storageKey: string): Promise<T[]> => {
  try {
    console.log(`Fetching ${tableName} data...`);
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      console.log(`User authenticated, fetching ${tableName} from Supabase`);
      
      // Try to get data from the main table if it exists
      const { data: tableData, error: tableError } = await supabase
        .from(tableName)
        .select('*');
      
      if (!tableError && tableData && tableData.length > 0) {
        console.log(`Retrieved ${tableData.length} ${tableName} from Supabase table`);
        
        // Update localStorage as backup
        localStorage.setItem(storageKey, JSON.stringify(tableData));
        
        return tableData as T[];
      }
      
      // If no data in the main table or it doesn't exist, check user_entries
      console.log(`Checking user_entries for ${storageKey}...`);
      const { data: entriesData, error: entriesError } = await supabase
        .from('user_entries')
        .select('*')
        .eq('entry_type', storageKey);
      
      if (!entriesError && entriesData && entriesData.length > 0) {
        const parsedData: T[] = [];
        
        for (const entry of entriesData) {
          try {
            const item = JSON.parse(entry.content);
            if (item) {
              parsedData.push(item as T);
            }
          } catch (e) {
            console.error(`Error parsing ${storageKey} entry:`, e);
          }
        }
        
        console.log(`Retrieved ${parsedData.length} ${storageKey} from user_entries`);
        
        if (parsedData.length > 0) {
          // Update localStorage as backup
          localStorage.setItem(storageKey, JSON.stringify(parsedData));
          return parsedData;
        }
      }
    }
    
    // Fall back to localStorage
    const localData = localStorage.getItem(storageKey);
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        console.log(`Retrieved ${Array.isArray(parsedData) ? parsedData.length : 0} ${storageKey} from localStorage`);
        return Array.isArray(parsedData) ? parsedData : [parsedData];
      } catch (e) {
        console.error(`Error parsing ${storageKey} from localStorage:`, e);
      }
    }
    
    console.log(`No ${storageKey} data found`);
    return [];
  } catch (error) {
    console.error(`Error fetching ${storageKey} data:`, error);
    toast({
      title: "Error",
      description: `Failed to fetch ${tableName} data. Please try again.`,
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Generic function to save data to Supabase and localStorage
 * @param tableName The name of the table to save to
 * @param storageKey The localStorage key for backup
 * @param data The data to save
 * @returns Promise resolving when save is complete
 */
export const saveData = async <T extends { id: string }>(
  tableName: string, 
  storageKey: string, 
  data: T[]
): Promise<void> => {
  try {
    console.log(`Saving ${data.length} items to ${tableName}...`);
    
    // Always save to localStorage first for immediate availability
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      console.log(`User authenticated, saving ${tableName} to Supabase`);
      
      try {
        // Try to save to the main table if it exists
        const { error } = await supabase
          .from(tableName)
          .upsert(
            data.map(item => ({
              ...item,
              user_id: session.session.user.id,
              updated_at: new Date()
            })),
            { onConflict: 'id' }
          );
        
        if (!error) {
          console.log(`Saved ${data.length} items to ${tableName} table`);
          return;
        }
        
        console.error(`Error saving to ${tableName} table:`, error);
        console.log(`Falling back to user_entries for ${storageKey}`);
      } catch (tableError) {
        console.error(`Error accessing ${tableName} table:`, tableError);
      }
      
      // If saving to main table fails, save to user_entries
      // First delete existing entries
      const { error: deleteError } = await supabase
        .from('user_entries')
        .delete()
        .eq('entry_type', storageKey);
      
      if (deleteError) {
        console.error(`Error deleting existing ${storageKey} entries:`, deleteError);
      }
      
      // Insert new entries
      if (data.length > 0) {
        const { error: insertError } = await supabase
          .from('user_entries')
          .insert(
            data.map(item => ({
              entry_type: storageKey,
              content: JSON.stringify(item),
              user_id: session.session.user.id
            }))
          );
        
        if (insertError) {
          console.error(`Error saving ${storageKey} to user_entries:`, insertError);
        } else {
          console.log(`Saved ${data.length} items to user_entries as ${storageKey}`);
        }
      }
    } else {
      console.log(`User not authenticated, ${storageKey} saved only to localStorage`);
    }
  } catch (error) {
    console.error(`Error saving ${storageKey} data:`, error);
    toast({
      title: "Error",
      description: `Failed to save ${tableName} data. Your changes might not persist after reload.`,
      variant: "destructive",
    });
  }
};
